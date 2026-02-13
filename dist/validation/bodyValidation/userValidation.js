"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInfoSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema untuk update user info
 */
exports.updateUserInfoSchema = joi_1.default.object({
    email: joi_1.default.string().email().optional().messages({
        "string.email": "Format email tidak valid",
    }),
    fullname: joi_1.default.string().min(3).max(100).optional().messages({
        "string.min": "Nama lengkap minimal 3 karakter",
        "string.max": "Nama lengkap maksimal 100 karakter",
    }),
    phone: joi_1.default.string()
        .pattern(/^[+]?[0-9]{8,15}$/)
        .optional()
        .messages({
        "string.pattern.base": "Nomor telepon harus berisi 8-15 digit angka",
    }),
})
    .min(1)
    .messages({
    "object.min": "Minimal ada 1 field yang harus diubah (email, fullname, atau phone)",
});
//# sourceMappingURL=userValidation.js.map