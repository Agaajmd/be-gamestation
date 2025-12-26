"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBranchSchema = exports.createBranchSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Facilities schema for branch amenities
 */
const facilitiesSchema = joi_1.default.object({
    general: joi_1.default.array().items(joi_1.default.string()).optional().default([]),
    foodAndBeverage: joi_1.default.array().items(joi_1.default.string()).optional().default([]),
    parking: joi_1.default.array().items(joi_1.default.string()).optional().default([]),
    entertainment: joi_1.default.array().items(joi_1.default.string()).optional().default([]),
    accessibility: joi_1.default.array().items(joi_1.default.string()).optional().default([]),
});
/**
 * Validation schema untuk create branch
 */
exports.createBranchSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(120).required().messages({
        "string.min": "Nama cabang minimal 3 karakter",
        "string.max": "Nama cabang maksimal 120 karakter",
        "any.required": "Nama cabang wajib diisi",
    }),
    address: joi_1.default.string().optional().allow(null, ""),
    phone: joi_1.default.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .optional()
        .allow(null, "")
        .messages({
        "string.pattern.base": "Format nomor telepon tidak valid",
    }),
    timezone: joi_1.default.string().optional().messages({
        "string.base": "Timezone harus berupa string",
    }),
    openTime: joi_1.default.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
        .optional()
        .allow(null, "")
        .messages({
        "string.pattern.base": "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
    closeTime: joi_1.default.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
        .optional()
        .allow(null, "")
        .messages({
        "string.pattern.base": "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
    facilities: facilitiesSchema.optional().messages({
        "object.base": "Facilities harus berupa object",
    }),
});
/**
 * Validation schema untuk update branch
 */
exports.updateBranchSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(120).optional().messages({
        "string.min": "Nama cabang minimal 3 karakter",
        "string.max": "Nama cabang maksimal 120 karakter",
    }),
    address: joi_1.default.string().optional().allow(null, ""),
    phone: joi_1.default.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .optional()
        .allow(null, "")
        .messages({
        "string.pattern.base": "Format nomor telepon tidak valid",
    }),
    timezone: joi_1.default.string().optional(),
    openTime: joi_1.default.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
        .optional()
        .allow(null, "")
        .messages({
        "string.pattern.base": "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
    closeTime: joi_1.default.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
        .optional()
        .allow(null, "")
        .messages({
        "string.pattern.base": "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
    facilities: facilitiesSchema.optional().messages({
        "object.base": "Facilities harus berupa object",
    }),
});
//# sourceMappingURL=branchValidation.js.map