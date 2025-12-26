"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableDatesSchema = exports.getAvailableTimesSchema = exports.getAvailableRoomsAndDevicesSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema untuk query mendapatkan room dan device yang tersedia
 * Query params: categoryId, bookingDate, startTime, durationMinutes
 */
exports.getAvailableRoomsAndDevicesSchema = joi_1.default.object({
    categoryId: joi_1.default.string().required().messages({
        "any.required": "Category ID wajib diisi",
        "string.base": "Category ID harus berupa string",
    }),
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
        "number.base": "Durasi harus berupa angka",
        "number.integer": "Durasi harus angka bulat",
        "number.positive": "Durasi harus lebih dari 0",
        "any.required": "Durasi wajib diisi",
    }),
});
/**
 * Validation schema untuk query mendapatkan available times
 * Query params: categoryId, bookingDate, durationMinutes
 */
exports.getAvailableTimesSchema = joi_1.default.object({
    categoryId: joi_1.default.string().required().messages({
        "any.required": "Category ID wajib diisi",
    }),
    bookingDate: joi_1.default.string().isoDate().required().messages({
        "string.isoDate": "Format tanggal tidak valid (gunakan YYYY-MM-DD)",
        "any.required": "Tanggal booking wajib diisi",
    }),
    durationMinutes: joi_1.default.number().integer().positive().required().messages({
        "number.base": "Durasi harus berupa angka",
        "number.integer": "Durasi harus angka bulat",
        "number.positive": "Durasi harus lebih dari 0",
        "any.required": "Durasi wajib diisi",
    }),
});
/**
 * Validation schema untuk query mendapatkan available dates
 * Query params: branchId, month
 */
exports.getAvailableDatesSchema = joi_1.default.object({
    branchId: joi_1.default.string().required().messages({
        "any.required": "Branch ID wajib diisi",
        "string.base": "Branch ID harus berupa string",
    }),
    month: joi_1.default.string()
        .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
        .required()
        .messages({
        "string.pattern.base": "Format bulan tidak valid (gunakan YYYY-MM)",
        "any.required": "Bulan wajib diisi",
    }),
});
//# sourceMappingURL=bookingQueryValidation.js.map