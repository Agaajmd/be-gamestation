"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBookingPriceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema untuk calculate booking price
 */
exports.calculateBookingPriceSchema = joi_1.default.object({
    branchId: joi_1.default.string().required().messages({
        "any.required": "Branch ID wajib diisi",
    }),
    deviceId: joi_1.default.string().required().messages({
        "any.required": "Device ID wajib diisi",
    }),
    categoryId: joi_1.default.string().optional().allow(null),
    bookingDate: joi_1.default.string().isoDate().required().messages({
        "string.isoDate": "Format tanggal tidak valid (gunakan YYYY-MM-DD)",
        "any.required": "Tanggal booking wajib diisi",
    }),
    startTime: joi_1.default.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
        "string.pattern.base": "Format waktu tidak valid (gunakan HH:mm)",
        "any.required": "Waktu mulai wajib diisi",
    }),
    durationMinutes: joi_1.default.number().integer().positive().required().messages({
        "number.integer": "Durasi harus angka bulat",
        "number.positive": "Durasi harus positif",
        "any.required": "Durasi wajib diisi",
    }),
});
//# sourceMappingURL=bookingValidation.js.map