"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.loginOTP = exports.login = exports.register = void 0;
const authService_1 = require("../service/AuthService/authService");
const responseHelper_1 = require("../helper/responseHelper");
/**
 * POST /auth/register
 * Register new user (customer role only)
 */
const register = async (req, res) => {
    try {
        const result = await (0, authService_1.registerUser)(req.body);
        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                user: {
                    ...result.newUser,
                    id: result.newUser.id.toString(),
                },
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.register = register;
/**
 * POST /auth/login
 * Login with email and password
 */
const login = async (req, res) => {
    try {
        const result = await (0, authService_1.loginUser)(req.body);
        // Response with data according to user role
        const responseData = {
            user: {
                id: result.user.id.toString(),
                email: result.user.email,
                fullname: result.user.fullname,
                role: result.user.role,
                phone: result.user.phone,
            },
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        };
        // Add additional data if user is owner
        if (result.user.owner) {
            responseData.owner = {
                id: result.user.owner.id.toString(),
                companyName: result.user.owner.companyName,
            };
        }
        // Add additional data if user is admin
        if (result.user.admin) {
            responseData.admin = {
                id: result.user.admin.id.toString(),
                branchId: result.user.admin.branchId.toString(),
                branchName: result.user.admin.branch.name,
                role: result.user.admin.role,
            };
        }
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: responseData,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.login = login;
/**
 * POST /auth/login-otp
 * Login using OTP sent to email/phone
 * Step 1: POST /auth/login-otp with { email } - send OTP
 * Step 2: POST /auth/login-otp with { email, otp } - verify OTP
 */
const loginOTP = async (req, res) => {
    try {
        const result = await (0, authService_1.loginUserOTP)(req.body);
        if (result.status === "OTP_SENT") {
            res.status(200).json({
                success: true,
                message: result.message,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: {
                user: {
                    id: result.user.id.toString(),
                    email: result.user.email,
                    fullname: result.user.fullname,
                    role: result.user.role,
                    phone: result.user.phone,
                },
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.loginOTP = loginOTP;
/**
 * POST /auth/refresh-token
 * Refresh access token menggunakan refresh token
 */
const refreshToken = async (req, res) => {
    try {
        const result = await (0, authService_1.refreshAccessToken)(req.body);
        res.status(200).json({
            success: true,
            message: "Token berhasil di-refresh",
            data: {
                accessToken: result.newAccessToken,
                refreshToken: result.newRefreshToken,
            },
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
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
        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: "Header Authorization wajib diisi",
            });
            return;
        }
        await (0, authService_1.logoutUser)({ authHeader });
        // TODO: Implement token blacklist (gunakan Redis)
        // Tambahkan token ke blacklist sampai expired
        // await redisClient.setex(`blacklist:${token}`, JWT_EXPIRES_IN, 'true');
        res.status(200).json({
            success: true,
            message: "Logout berhasil",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.logout = logout;
/**
 * POST /auth/forgot-password
 * Request reset password - kirim OTP ke email
 */
const forgotPassword = async (req, res) => {
    try {
        await (0, authService_1.forgetPasswordUser)(req.body);
        res.status(200).json({
            success: true,
            message: "Jika email terdaftar, OTP akan dikirim ke email Anda",
            data: {
                expiresIn: 600, // 10 menit dalam detik
            },
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.forgotPassword = forgotPassword;
/**
 * POST /auth/reset-password
 * Reset password dengan OTP dan password baru
 */
const resetPassword = async (req, res) => {
    try {
        await (0, authService_1.resetPasswordUser)(req.body);
        res.status(200).json({
            success: true,
            message: "Password berhasil direset. Silakan login dengan password baru",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=AuthController.js.map