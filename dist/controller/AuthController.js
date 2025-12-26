"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.loginOTP = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import crypto from "crypto";
const prisma_1 = __importDefault(require("../lib/prisma"));
const emailHelper_1 = require("../helper/emailHelper");
// Konfigurasi JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const JWT_EXPIRES_IN = "15m"; // Access token expire in 15 minutes
const JWT_REFRESH_EXPIRES_IN = "7d"; // Refresh token expire in 7 days
// Temporary OTP storage (gunakan Redis di production)
const otpStore = new Map();
/**
 * POST /auth/register
 * Register user baru dengan email dan password
 */
const register = async (req, res) => {
    try {
        const { email, password, fullname, phone } = req.body;
        // Validasi input
        if (!email || !fullname) {
            res.status(400).json({
                success: false,
                message: "Email dan fullname wajib diisi",
            });
            return;
        }
        // Cek apakah email sudah terdaftar
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "Email sudah terdaftar",
            });
            return;
        }
        // Hash password jika ada
        let passwordHash = null;
        if (password) {
            passwordHash = await bcrypt_1.default.hash(password, 10);
        }
        // Buat user baru
        const newUser = await prisma_1.default.user.create({
            data: {
                email,
                passwordHash,
                fullname,
                phone,
                role: "customer",
            },
            select: {
                id: true,
                email: true,
                fullname: true,
                role: true,
                phone: true,
                createdAt: true,
            },
        });
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({
            userId: newUser.id.toString(),
            email: newUser.email,
            role: newUser.role,
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const refreshToken = jsonwebtoken_1.default.sign({
            userId: newUser.id.toString(),
            email: newUser.email,
            role: newUser.role,
        }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
        res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            data: {
                user: {
                    ...newUser,
                    id: newUser.id.toString(),
                },
                accessToken,
                refreshToken,
            },
        });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat registrasi",
        });
    }
};
exports.register = register;
/**
 * POST /auth/login
 * Login dengan email dan password
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validasi input
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email dan password wajib diisi",
            });
            return;
        }
        // Cari user berdasarkan email dengan relasi owner dan admin
        const user = await prisma_1.default.user.findUnique({
            where: { email },
            include: {
                owner: true,
                admin: {
                    include: {
                        branch: true,
                    },
                },
            },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Email atau password salah",
            });
            return;
        }
        // Cek apakah user menggunakan password (bukan OTP-only)
        if (!user.passwordHash) {
            res.status(401).json({
                success: false,
                message: "Akun ini menggunakan login OTP. Silakan gunakan /auth/login-otp",
            });
            return;
        }
        // Verifikasi password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Email atau password salah",
            });
            return;
        }
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({
            userId: user.id.toString(),
            email: user.email,
            role: user.role,
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const refreshToken = jsonwebtoken_1.default.sign({
            userId: user.id.toString(),
            email: user.email,
            role: user.role,
        }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
        // Update last login timestamp
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { updatedAt: new Date() },
        });
        // Response dengan data tambahan sesuai role
        const responseData = {
            user: {
                id: user.id.toString(),
                email: user.email,
                fullname: user.fullname,
                role: user.role,
                phone: user.phone,
            },
            accessToken,
            refreshToken,
        };
        // Tambahkan data owner jika role owner
        if (user.owner) {
            responseData.owner = {
                id: user.owner.id.toString(),
                companyName: user.owner.companyName,
            };
        }
        // Tambahkan data admin jika role admin
        if (user.admin) {
            responseData.admin = {
                id: user.admin.id.toString(),
                branchId: user.admin.branchId.toString(),
                branchName: user.admin.branch.name,
                role: user.admin.role,
            };
        }
        res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: responseData,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat login",
        });
    }
};
exports.login = login;
/**
 * POST /auth/login-otp
 * Login menggunakan OTP yang dikirim ke email/phone
 * Step 1: POST /auth/login-otp dengan { email } - kirim OTP
 * Step 2: POST /auth/login-otp dengan { email, otp } - verify OTP
 */
const loginOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        // Validasi input
        if (!email) {
            res.status(400).json({
                success: false,
                message: "Email wajib diisi",
            });
            return;
        }
        // Step 1: Request OTP
        if (!otp) {
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            otpStore.set(email, {
                otp: newOtp,
                expiresAt,
            });
            // Send OTP via email
            const emailSent = await (0, emailHelper_1.sendOTPEmail)({
                to: email,
                otp: newOtp,
                expiresInMinutes: 5,
            });
            if (!emailSent) {
                // Fallback: still log to console if email fails
                console.log(`[OTP] Email: ${email}, OTP: ${newOtp} (expires at ${expiresAt})`);
                console.log("[WARNING] Email delivery failed, check console for OTP");
            }
            res.status(200).json({
                success: true,
                message: emailSent
                    ? "OTP telah dikirim ke email Anda. Berlaku selama 5 menit."
                    : "OTP berhasil dibuat. Check console server (email delivery failed).",
                data: {
                    email,
                    expiresIn: 300,
                    emailSent, // For debugging
                },
            });
            return;
        }
        // Step 2: Verify OTP
        const storedOTP = otpStore.get(email);
        if (!storedOTP) {
            res.status(400).json({
                success: false,
                message: "OTP tidak ditemukan atau sudah expired. Silakan request OTP baru",
            });
            return;
        }
        // Cek apakah OTP expired
        if (new Date() > storedOTP.expiresAt) {
            otpStore.delete(email);
            res.status(400).json({
                success: false,
                message: "OTP sudah expired. Silakan request OTP baru",
            });
            return;
        }
        // Verifikasi OTP
        if (storedOTP.otp !== otp) {
            res.status(401).json({
                success: false,
                message: "OTP tidak valid",
            });
            return;
        }
        // OTP valid, hapus dari storage
        otpStore.delete(email);
        // Get user data
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
            return;
        }
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({
            userId: user.id.toString(),
            email: user.email,
            role: user.role,
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const refreshToken = jsonwebtoken_1.default.sign({
            userId: user.id.toString(),
            email: user.email,
            role: user.role,
        }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
        // Update last login
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { updatedAt: new Date() },
        });
        res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: {
                user: {
                    id: user.id.toString(),
                    email: user.email,
                    fullname: user.fullname,
                    role: user.role,
                    phone: user.phone,
                },
                accessToken,
                refreshToken,
            },
        });
    }
    catch (error) {
        console.error("Login OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat login dengan OTP",
        });
    }
};
exports.loginOTP = loginOTP;
/**
 * POST /auth/refresh-token
 * Refresh access token menggunakan refresh token
 */
const refreshToken = async (req, res) => {
    try {
        console.log("REFRESH BODY:", req.body);
        const { refreshToken: token } = req.body;
        // Validasi input
        if (!token) {
            res.status(400).json({
                success: false,
                message: "Refresh token wajib diisi",
            });
            return;
        }
        // Verify refresh token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: "Refresh token tidak valid atau expired",
            });
            return;
        }
        // Cek apakah user masih ada
        const user = await prisma_1.default.user.findUnique({
            where: { id: BigInt(decoded.userId) },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
            return;
        }
        // Generate new access token
        const newAccessToken = jsonwebtoken_1.default.sign({
            userId: user.id.toString(),
            email: user.email,
            role: user.role,
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Optional: Generate new refresh token (rotation)
        const newRefreshToken = jsonwebtoken_1.default.sign({
            userId: user.id.toString(),
            email: user.email,
            role: user.role,
        }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
        res.status(200).json({
            success: true,
            message: "Token berhasil di-refresh",
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    }
    catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat refresh token",
        });
    }
};
exports.refreshToken = refreshToken;
/**
 * POST /auth/logout
 * Logout user (invalidate token - implement token blacklist di production)
 */
const logout = async (req, res) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            res.status(400).json({
                success: false,
                message: "Token tidak ditemukan",
            });
            return;
        }
        // Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: "Token tidak valid",
            });
            return;
        }
        // TODO: Implement token blacklist (gunakan Redis)
        // Tambahkan token ke blacklist sampai expired
        // await redisClient.setex(`blacklist:${token}`, JWT_EXPIRES_IN, 'true');
        // Log audit
        await prisma_1.default.auditLog.create({
            data: {
                userId: BigInt(decoded.userId),
                action: "LOGOUT",
                entity: "Auth",
                entityId: BigInt(decoded.userId),
                meta: {
                    email: decoded.email,
                    timestamp: new Date().toISOString(),
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "Logout berhasil",
        });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat logout",
        });
    }
};
exports.logout = logout;
/**
 * POST /auth/forgot-password
 * Request reset password - kirim OTP ke email
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                success: false,
                message: "Email wajib diisi",
            });
            return;
        }
        // Cek apakah user ada
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        // Selalu return success untuk security (hindari email enumeration)
        if (!user) {
            res.status(200).json({
                success: true,
                message: "Jika email terdaftar, OTP akan dikirim ke email Anda",
            });
            return;
        }
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit
        // Store OTP dengan userId
        otpStore.set(email, {
            otp,
            expiresAt,
            userId: user.id,
        });
        // Send OTP via email
        const emailSent = await (0, emailHelper_1.sendOTPEmail)({
            to: email,
            otp,
            expiresInMinutes: 10,
            purpose: "reset password",
        });
        if (!emailSent) {
            console.log(`[RESET PASSWORD OTP] Email: ${email}, OTP: ${otp}`);
        }
        res.status(200).json({
            success: true,
            message: "Jika email terdaftar, OTP akan dikirim ke email Anda",
            data: {
                expiresIn: 600, // 10 menit dalam detik
            },
        });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memproses permintaan",
        });
    }
};
exports.forgotPassword = forgotPassword;
/**
 * POST /auth/reset-password
 * Reset password dengan OTP dan password baru
 */
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            res.status(400).json({
                success: false,
                message: "Email, OTP, dan password baru wajib diisi",
            });
            return;
        }
        // Validasi OTP
        const storedOTP = otpStore.get(email);
        if (!storedOTP) {
            res.status(400).json({
                success: false,
                message: "OTP tidak ditemukan atau sudah expired",
            });
            return;
        }
        // Cek expired
        if (new Date() > storedOTP.expiresAt) {
            otpStore.delete(email);
            res.status(400).json({
                success: false,
                message: "OTP sudah expired. Silakan request OTP baru",
            });
            return;
        }
        // Verifikasi OTP
        if (storedOTP.otp !== otp) {
            res.status(401).json({
                success: false,
                message: "OTP tidak valid",
            });
            return;
        }
        // Hash password baru
        const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        // Update password
        await prisma_1.default.user.update({
            where: { email },
            data: {
                passwordHash,
                updatedAt: new Date(),
            },
        });
        // Hapus OTP dari storage
        otpStore.delete(email);
        // Log audit
        if (storedOTP.userId) {
            await prisma_1.default.auditLog.create({
                data: {
                    userId: storedOTP.userId,
                    action: "RESET_PASSWORD",
                    entity: "Auth",
                    entityId: storedOTP.userId,
                    meta: {
                        email,
                        timestamp: new Date().toISOString(),
                    },
                },
            });
        }
        res.status(200).json({
            success: true,
            message: "Password berhasil direset. Silakan login dengan password baru",
        });
    }
    catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat reset password",
        });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=AuthController.js.map