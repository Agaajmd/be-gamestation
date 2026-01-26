"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAndStoreOTP = generateAndStoreOTP;
exports.verifyOTP = verifyOTP;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Temporary OTP storage (in-memory). In production, use a persistent store like Redis or a database.
const otpStore = new Map();
// Use secure random generation for OTP
function generateSecureOTP(length = 6) {
    // Untuk 6 digit: 100000 - 999999
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return crypto_1.default.randomInt(min, max + 1).toString();
}
// Hash OTP before storing
async function generateAndStoreOTP(email) {
    const otp = generateSecureOTP(6);
    const hashedOTP = await bcrypt_1.default.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    // Store the hashed OTP, not the plaintext
    otpStore.set(email, {
        otp: hashedOTP,
        expiresAt,
        attempts: 0, // Track attempts for rate limiting
    });
    return otp; // Return plaintext to send to user
}
// Verify OTP
async function verifyOTP(email, inputOTP) {
    const stored = otpStore.get(email);
    if (!stored) {
        return false;
    }
    // Check expiry
    if (new Date() > stored.expiresAt) {
        otpStore.delete(email);
        return false;
    }
    // Check attempts (max 3 attempts)
    if (stored.attempts >= 3) {
        otpStore.delete(email);
        throw new Error("Too many failed attempts");
    }
    // Compare OTP
    const isValid = await bcrypt_1.default.compare(inputOTP, stored.otp);
    if (!isValid) {
        stored.attempts++;
        return false;
    }
    // Valid! Delete OTP
    otpStore.delete(email);
    return true;
}
//# sourceMappingURL=generateOTP.js.map