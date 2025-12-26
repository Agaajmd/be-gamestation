"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.addCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema untuk add category
 */
exports.addCategorySchema = joi_1.default.object({
    name: joi_1.default.string().max(50).required().messages({
        "string.max": "Nama kategori maksimal 50 karakter",
        "any.required": "Nama kategori wajib diisi",
    }),
    description: joi_1.default.string().max(255).optional().allow(null).messages({
        "string.max": "Deskripsi kategori maksimal 255 karakter",
    }),
    tier: joi_1.default.string().valid("regular", "vip", "vvip").required().messages({
        "any.only": "Tier harus salah satu dari: regular, vip, vvip",
        "any.required": "Tier wajib diisi",
    }),
    pricePerHour: joi_1.default.number().positive().precision(2).required().messages({
        "number.positive": "Harga per jam harus positif",
        "any.required": "Harga per jam wajib diisi",
    }),
    amenities: joi_1.default.array().optional().allow(null),
});
/**
 * Validation schema untuk update category
 */
exports.updateCategorySchema = joi_1.default.object({
    name: joi_1.default.string().max(50).optional().messages({
        "string.max": "Nama kategori maksimal 50 karakter",
    }),
    description: joi_1.default.string().max(255).optional().allow(null).messages({
        "string.max": "Deskripsi kategori maksimal 255 karakter",
    }),
    tier: joi_1.default.string().valid("regular", "vip", "vvip").optional().messages({
        "any.only": "Tier harus salah satu dari: regular, vip, vvip",
    }),
    pricePerHour: joi_1.default.number().positive().precision(2).optional().messages({
        "number.positive": "Harga per jam harus positif",
    }),
    amenities: joi_1.default.array().optional().allow(null),
});
//# sourceMappingURL=categoryValidation.js.map