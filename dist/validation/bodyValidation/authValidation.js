"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokenSchema = exports.loginOTPSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema untuk register
 */
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Format email tidak valid",
        "any.required": "Email wajib diisi",
    }),
    password: joi_1.default.string().min(8).required().messages({
        "string.min": "Password minimal 8 karakter",
        "any.required": "Password wajib diisi",
    }),
    fullname: joi_1.default.string().min(3).max(100).required().messages({
        "string.min": "Nama lengkap minimal 3 karakter",
        "string.max": "Nama lengkap maksimal 100 karakter",
        "any.required": "Nama lengkap wajib diisi",
    }),
    phone: joi_1.default.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .required()
        .messages({
        "string.pattern.base": "Format nomor telepon tidak valid",
        "any.required": "Nomor telepon wajib diisi",
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
/**
 * Validation schema untuk forgot password
 */
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Format email tidak valid",
        "any.required": "Email wajib diisi",
    }),
});
/**
 * Validation schema untuk reset password
 */
exports.resetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Format email tidak valid",
        "any.required": "Email wajib diisi",
    }),
    otp: joi_1.default.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
        "string.length": "OTP harus 6 digit",
        "string.pattern.base": "OTP harus berupa angka",
        "any.required": "OTP wajib diisi",
    }),
    newPassword: joi_1.default.string().min(8).required().messages({
        "string.min": "Password minimal 8 karakter",
        "any.required": "Password baru wajib diisi",
    }),
});
//# sourceMappingURL=authValidation.js.map