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
const sendVerificationEmail_1 = require("../../helper/sendVerificationEmail");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
const password_2 = require("../../helper/password");
// Error
const authError_1 = require("../../errors/AuthError/authError");
// Service function to handle user registration
async function registerUser(payload) {
    const { email, password, fullname, phone } = payload;
    // Sanitize inputs
    const sanitizedEmail = (0, inputSanitizer_1.sanitizeEmail)(email);
    const sanitizedFullname = (0, inputSanitizer_1.sanitizeString)(fullname);
    const sanitizedPhone = (0, inputSanitizer_1.sanitizeString)(phone);
    if (!sanitizedEmail) {
        throw new authError_1.InvalidEmailFormatError();
    }
    if (!sanitizedFullname || !sanitizedPhone) {
        throw new Error("Name and phone must be valid");
    }
    const existing = await userRepository_1.UserRepository.findByEmail(sanitizedEmail);
    if (existing) {
        throw new authError_1.EmailExistingError();
    }
    const passwordValidation = (0, password_2.validatePasswordPolicy)(password);
    if (!passwordValidation.isValid) {
        throw new authError_1.PasswordError(passwordValidation.errors);
    }
    const passwordHash = await (0, password_1.hashPassword)(password);
    const plainToken = (0, sendVerificationEmail_1.generateVerificationToken)();
    const hashedToken = (0, sendVerificationEmail_1.hashToken)(plainToken);
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newUser = await userRepository_1.UserRepository.createUser({
        email: sanitizedEmail,
        passwordHash,
        fullname: sanitizedFullname,
        phone: sanitizedPhone,
        verificationToken: hashedToken,
        verificationTokenExpires: tokenExpires,
    });
    (0, sendVerificationEmail_1.sendVerificationEmail)({
        to: sanitizedEmail,
        token: plainToken, // Plain token, bukan yang di-hash
        username: sanitizedFullname,
    }).catch((error) => {
        console.error(`⚠️ Failed to send verification email to ${sanitizedEmail}:`, error);
    });
    return newUser;
}
// Service function to handle user login
async function loginUser(payload) {
    const { email, password } = payload;
    // Sanitize email before database query
    const sanitizedEmail = (0, inputSanitizer_1.sanitizeEmail)(email);
    if (!sanitizedEmail) {
        throw new authError_1.InvalidEmailFormatError();
    }
    const user = await userRepository_1.UserRepository.findByEmailWithOwnerAndAdmin(sanitizedEmail);
    if (!user) {
        throw new authError_1.EmailNotFoundError();
    }
    if (!user.passwordHash) {
        throw new authError_1.PasswordError();
    }
    if (!user.isVerified) {
        throw new authError_1.EmailNotVerifiedError();
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
    // Sanitize email
    const sanitizedEmail = (0, inputSanitizer_1.sanitizeEmail)(email);
    if (!sanitizedEmail) {
        throw new authError_1.InvalidEmailFormatError();
    }
    // Sanitize OTP if provided (alphanumeric only)
    const sanitizedOtp = otp ? (0, inputSanitizer_1.sanitizeString)(otp) : undefined;
    // Check if OTP is provided
    if (!sanitizedOtp) {
        const newOtp = await (0, generateOTP_1.generateAndStoreOTP)(sanitizedEmail);
        const emailSent = await (0, emailHelper_1.sendOTPEmail)({
            to: sanitizedEmail,
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
    // Verify OTP with sanitized values
    const isOtpValid = await (0, generateOTP_1.verifyOTP)(sanitizedEmail, sanitizedOtp);
    if (!isOtpValid) {
        throw new authError_1.OTPInvalidError();
    }
    const user = await userRepository_1.UserRepository.findByEmail(sanitizedEmail);
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
    // Sanitize email
    const sanitizedEmail = (0, inputSanitizer_1.sanitizeEmail)(email);
    if (!sanitizedEmail) {
        throw new authError_1.InvalidEmailFormatError();
    }
    const user = await userRepository_1.UserRepository.findByEmail(sanitizedEmail);
    if (!user) {
        throw new authError_1.UserNotFoundError();
    }
    const otp = await (0, generateOTP_1.generateAndStoreOTP)(sanitizedEmail);
    await (0, emailHelper_1.sendOTPEmail)({
        to: sanitizedEmail,
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
    // Sanitize inputs
    const sanitizedEmail = (0, inputSanitizer_1.sanitizeEmail)(email);
    const sanitizedOtp = (0, inputSanitizer_1.sanitizeString)(otp);
    if (!sanitizedEmail) {
        throw new authError_1.InvalidEmailFormatError();
    }
    // Validate new password strength
    const passwordValidation = (0, password_2.validatePasswordPolicy)(newPassword);
    if (!passwordValidation.isValid) {
        throw new authError_1.PasswordError(passwordValidation.errors);
    }
    const isOtpValid = await (0, generateOTP_1.verifyOTP)(sanitizedEmail, sanitizedOtp);
    if (!isOtpValid) {
        throw new authError_1.OTPInvalidError();
    }
    const passwordHash = await (0, password_1.hashPassword)(newPassword);
    await userRepository_1.UserRepository.updatePassword(sanitizedEmail, passwordHash);
    const user = await userRepository_1.UserRepository.findByEmail(sanitizedEmail);
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