"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.loginUserOTP = loginUserOTP;
exports.refreshAccessToken = refreshAccessToken;
exports.logoutUser = logoutUser;
exports.forgetPasswordUser = forgetPasswordUser;
exports.resetPasswordUser = resetPasswordUser;
const userRepository_1 = require("../../repository/userRepository");
const auditLogRepository_1 = require("../../repository/auditLogRepository");
const password_1 = require("../../helper/password");
const jwtHelper_1 = require("../../helper/jwtHelper");
const generateOTP_1 = require("../../helper/generateOTP");
const emailHelper_1 = require("../../helper/emailHelper");
// Error
const authError_1 = require("../../errors/AuthError/authError");
// Service function to handle user registration
async function registerUser(payload) {
    const { email, password, fullname, phone } = payload;
    const existing = await userRepository_1.UserRepository.findByEmail(email);
    if (existing) {
        throw new authError_1.EmailExistingError();
    }
    const passwordHash = await (0, password_1.hashPassword)(password);
    const newUser = await userRepository_1.UserRepository.createUser({
        email,
        passwordHash,
        fullname,
        phone,
    });
    const accessToken = jwtHelper_1.generateToken.accessToken(newUser.id, newUser.email, "customer");
    const refreshToken = jwtHelper_1.generateToken.refreshToken(newUser.id, newUser.email, "customer");
    return { newUser, accessToken, refreshToken };
}
// Service function to handle user login
async function loginUser(payload) {
    const { email, password } = payload;
    const user = await userRepository_1.UserRepository.findByEmailWithOwnerAndAdmin(email);
    if (!user) {
        throw new authError_1.EmailNotFoundError();
    }
    if (!user.passwordHash) {
        throw new authError_1.PasswordError();
    }
    const isPasswordValid = await (0, password_1.comparePassword)(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new authError_1.PasswordError();
    }
    const accessToken = jwtHelper_1.generateToken.accessToken(user.id, user.email, user.role, user.admin?.role);
    const refreshToken = jwtHelper_1.generateToken.refreshToken(user.id, user.email, user.role, user.admin?.role);
    await userRepository_1.UserRepository.updateLastLogin(user.id);
    return { status: "SUCCESS", user, accessToken, refreshToken };
}
// Service function to handle OTP login (stub implementation)
async function loginUserOTP(payload) {
    const { email, otp } = payload;
    // Check if OTP is provided
    if (!otp) {
        const newOtp = await (0, generateOTP_1.generateAndStoreOTP)(email);
        const emailSent = await (0, emailHelper_1.sendOTPEmail)({
            to: email,
            otp: newOtp,
            expiresInMinutes: 5,
        });
        if (!emailSent) {
            // Fallback: still log to console if email fails
            console.log(`[OTP] Email: ${email}, OTP: ${newOtp} (expires at 5 minutes from now)`);
            console.log("[WARNING] Email delivery failed, check console for OTP");
        }
        return { status: "OTP_SENT", message: "OTP telah dikirim ke email" };
    }
    // Verify OTP
    const isOtpValid = await (0, generateOTP_1.verifyOTP)(email, otp);
    if (!isOtpValid) {
        throw new authError_1.OTPInvalidError();
    }
    const user = await userRepository_1.UserRepository.findByEmail(email);
    if (!user) {
        throw new authError_1.EmailNotFoundError();
    }
    const accessToken = jwtHelper_1.generateToken.accessToken(user.id, user.email, user.role, user.admin?.role);
    const refreshToken = jwtHelper_1.generateToken.refreshToken(user.id, user.email, user.role, user.admin?.role);
    await userRepository_1.UserRepository.updateLastLogin(user.id);
    return { status: "SUCCESS", user, accessToken, refreshToken };
}
// Service function to handle token refresh
async function refreshAccessToken(payload) {
    const { refreshToken: token } = payload;
    const decoded = jwtHelper_1.verifyToken.refreshToken(token);
    const user = await userRepository_1.UserRepository.findById(decoded.userId);
    if (!user) {
        throw new authError_1.UserNotFoundError();
    }
    const newAccessToken = jwtHelper_1.generateToken.accessToken(user.id, user.email, user.role, user.admin?.role);
    const newRefreshToken = jwtHelper_1.generateToken.refreshToken(user.id, user.email, user.role, user.admin?.role);
    await userRepository_1.UserRepository.updateLastLogin(user.id);
    return {
        status: "SUCCESS",
        newAccessToken,
        newRefreshToken,
    };
}
// Service function to handle user logout (stub implementation)
async function logoutUser(payload) {
    const { authHeader } = payload;
    const token = (0, jwtHelper_1.extractTokenFromHeader)(authHeader);
    if (!token) {
        throw new Error("Token tidak ditemukan di header Authorization");
    }
    const decoded = jwtHelper_1.verifyToken.accessToken(token);
    await auditLogRepository_1.AuditLogRepository.createAuditLog({
        userId: BigInt(decoded.userId),
        action: "LOGOUT",
        entity: "Auth",
        entityId: BigInt(decoded.userId),
        meta: {
            details: "User logged out",
            timestamp: new Date(),
        },
    });
}
// Service function to handle forgot password (stub implementation)
async function forgetPasswordUser(payload) {
    const { email } = payload;
    const user = await userRepository_1.UserRepository.findByEmail(email);
    if (!user) {
        throw new authError_1.UserNotFoundError();
    }
    const otp = await (0, generateOTP_1.generateAndStoreOTP)(email);
    await (0, emailHelper_1.sendOTPEmail)({
        to: email,
        otp,
        expiresInMinutes: 10,
    });
    await auditLogRepository_1.AuditLogRepository.createAuditLog({
        userId: user.id,
        action: "PASSWORD_RESET_REQUEST",
        entity: "Auth",
        entityId: user.id,
        meta: {
            details: "Password reset requested",
            timestamp: new Date(),
        },
    });
}
// Service function to handle reset password (stub implementation)
async function resetPasswordUser(payload) {
    const { email, otp, newPassword } = payload;
    const isOtpValid = await (0, generateOTP_1.verifyOTP)(email, otp);
    if (!isOtpValid) {
        throw new authError_1.OTPInvalidError();
    }
    const passwordHash = await (0, password_1.hashPassword)(newPassword);
    await userRepository_1.UserRepository.updatePassword(email, passwordHash);
    const user = await userRepository_1.UserRepository.findByEmail(email);
    if (user) {
        await auditLogRepository_1.AuditLogRepository.createAuditLog({
            userId: user.id,
            action: "PASSWORD_RESET",
            entity: "Auth",
            entityId: user.id,
            meta: {
                details: "Password has been reset",
                timestamp: new Date(),
            },
        });
    }
}
//# sourceMappingURL=authService.js.map