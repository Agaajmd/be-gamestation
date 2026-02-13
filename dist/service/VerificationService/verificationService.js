"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailService = verifyEmailService;
exports.resendVerificationEmailService = resendVerificationEmailService;
exports.checkVerificationStatusService = checkVerificationStatusService;
// Repository
const userRepository_1 = require("../../repository/userRepository");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Helper
const sendVerificationEmail_1 = require("../../helper/sendVerificationEmail");
// Error
const authError_1 = require("../../errors/AuthError/authError");
async function verifyEmailService(token) {
    // Sanitize input
    const sanitizedToken = (0, inputSanitizer_1.sanitizeString)(token);
    const hashedToken = (0, sendVerificationEmail_1.hashToken)(sanitizedToken);
    const user = await userRepository_1.UserRepository.findFirst({
        verificationToken: hashedToken,
    });
    if (!user) {
        throw new authError_1.UserNotFoundError();
    }
    if (user.isVerified) {
        return true;
    }
    if (!user.verificationTokenExpires ||
        new Date() > user.verificationTokenExpires) {
        throw new authError_1.TokenExpiredError();
    }
    await userRepository_1.UserRepository.updateVerification(user.id);
    return true;
}
async function resendVerificationEmailService(email) {
    // Sanitize input
    const sanitizedEmail = (0, inputSanitizer_1.sanitizeEmail)(email);
    const user = await userRepository_1.UserRepository.findByEmail(sanitizedEmail);
    if (!user) {
        throw new authError_1.UserNotFoundError();
    }
    if (user.isVerified) {
        throw new authError_1.EmailAlreadyVerifiedError();
    }
    if (user.verificationSentAt) {
        const lastSent = user.verificationSentAt.getTime();
        const now = Date.now();
        const cooldownMinutes = 2;
        if (now - lastSent < cooldownMinutes * 60 * 1000) {
            const remainingSeconds = Math.ceil((cooldownMinutes * 60 * 1000 - (now - lastSent)) / 1000);
            throw new authError_1.WaitingForVerificationError(remainingSeconds);
        }
    }
    const plainToken = (0, sendVerificationEmail_1.generateVerificationToken)();
    const hashedToken = (0, sendVerificationEmail_1.hashToken)(plainToken);
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await userRepository_1.UserRepository.updateVerification(user.id, hashedToken, tokenExpires);
    const emailSent = await (0, sendVerificationEmail_1.sendVerificationEmail)({
        to: sanitizedEmail,
        token: plainToken,
        username: user.fullname,
    });
    if (!emailSent) {
        throw new authError_1.FailedSendingEmailError();
    }
    return true;
}
async function checkVerificationStatusService(email) {
    // Sanitize input
    const sanitizedEmail = (0, inputSanitizer_1.sanitizeEmail)(email);
    const user = await userRepository_1.UserRepository.findByEmail(sanitizedEmail);
    if (!user) {
        throw new authError_1.UserNotFoundError();
    }
    return {
        isVerified: user.isVerified,
        lastSentAt: user.verificationSentAt,
    };
}
//# sourceMappingURL=verificationService.js.map