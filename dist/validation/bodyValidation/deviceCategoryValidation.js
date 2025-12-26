"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeviceCategorySchema = exports.addDeviceCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema untuk add device category
 */
exports.addDeviceCategorySchema = joi_1.default.object({
    name: joi_1.default.string().max(50).required().messages({
        "string.max": "Nama kategori maksimal 50 karakter",
        "any.required": "Nama kategori wajib diisi",
    }),
    tier: joi_1.default.string().valid("regular", "vip", "vvip").required().messages({
        "any.only": "Tier harus salah satu dari: regular, vip, vvip",
        "any.required": "Tier wajib diisi",
    }),
    deviceType: joi_1.default.string()
        .valid("ps", "racing", "vr", "pc", "arcade")
        .required()
        .messages({
        "any.only": "Device type harus salah satu dari: ps, racing, vr, pc, arcade",
        "any.required": "Device type wajib diisi",
    }),
    description: joi_1.default.string().optional().allow(null),
    pricePerHour: joi_1.default.number().positive().precision(2).required().messages({
        "number.positive": "Harga per jam harus positif",
        "any.required": "Harga per jam wajib diisi",
    }),
    amenities: joi_1.default.array().optional().allow(null),
    isActive: joi_1.default.boolean().optional(),
});
/**
 * Validation schema untuk update device category
 */
exports.updateDeviceCategorySchema = joi_1.default.object({
    name: joi_1.default.string().max(50).optional().messages({
        "string.max": "Nama kategori maksimal 50 karakter",
    }),
    tier: joi_1.default.string().valid("regular", "vip", "vvip").optional().messages({
        "any.only": "Tier harus salah satu dari: regular, vip, vvip",
    }),
    deviceType: joi_1.default.string()
        .valid("ps", "racing", "vr", "pc", "arcade")
        .optional()
        .messages({
        "any.only": "Device type harus salah satu dari: ps, racing, vr, pc, arcade",
    }),
    description: joi_1.default.string().optional().allow(null),
    pricePerHour: joi_1.default.number().positive().precision(2).optional().messages({
        "number.positive": "Harga per jam harus positif",
    }),
    amenities: joi_1.default.object().optional().allow(null),
    isActive: joi_1.default.boolean().optional(),
});
//# sourceMappingURL=deviceCategoryValidation.js.map