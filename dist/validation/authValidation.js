"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.loginOTPSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema untuk register
 */
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Format email tidak valid",
        "any.required": "Email wajib diisi",
    }),
    password: joi_1.default.string().min(6).optional().messages({
        "string.min": "Password minimal 6 karakter",
    }),
    fullname: joi_1.default.string().min(3).max(100).required().messages({
        "string.min": "Nama lengkap minimal 3 karakter",
        "string.max": "Nama lengkap maksimal 100 karakter",
        "any.required": "Nama lengkap wajib diisi",
    }),
    phone: joi_1.default.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .optional()
        .messages({
        "string.pattern.base": "Format nomor telepon tidak valid",
    }),
    role: joi_1.default.string()
        .valid("customer", "admin", "super_admin")
        .optional()
        .messages({
        "any.only": "Role harus salah satu dari: customer, admin, super_admin",
    }),
});
/**
 * Validation schema untuk login
 */
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Format email tidak valid",
        "any.required": "Email wajib diisi",
    }),
    password: joi_1.default.string().required().messages({
        "any.required": "Password wajib diisi",
    }),
});
/**
 * Validation schema untuk login OTP
 */
exports.loginOTPSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Format email tidak valid",
        "any.required": "Email wajib diisi",
    }),
    otp: joi_1.default.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .optional()
        .messages({
        "string.length": "OTP harus 6 digit",
        "string.pattern.base": "OTP harus berupa angka",
    }),
});
/**
 * Validation schema untuk refresh token
 */
exports.refreshTokenSchema = joi_1.default.object({
    refreshToken: joi_1.default.string().required().messages({
        "any.required": "Refresh token wajib diisi",
    }),
});
//# sourceMappingURL=authValidation.js.map