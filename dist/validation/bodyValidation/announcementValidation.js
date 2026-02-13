"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnnouncementSchema = exports.createAnnouncementSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema untuk create announcement
 */
exports.createAnnouncementSchema = joi_1.default.object({
    title: joi_1.default.string().min(3).max(150).required().messages({
        "string.min": "Judul minimal 3 karakter",
        "string.max": "Judul maksimal 150 karakter",
        "any.required": "Judul wajib diisi",
    }),
    content: joi_1.default.string().min(10).required().messages({
        "string.min": "Konten minimal 10 karakter",
        "any.required": "Konten wajib diisi",
    }),
    forBranch: joi_1.default.alternatives()
        .try(joi_1.default.number(), joi_1.default.string().pattern(/^\d+$/))
        .optional()
        .messages({
        "number.base": "forBranch harus berupa angka",
        "string.pattern.base": "forBranch harus berupa angka",
    }),
    startDate: joi_1.default.date().iso().required().messages({
        "date.base": "startDate harus berupa tanggal ISO format",
        "any.required": "startDate wajib diisi",
    }),
    endDate: joi_1.default.date().iso().greater(joi_1.default.ref("startDate")).required().messages({
        "date.base": "endDate harus berupa tanggal ISO format",
        "date.greater": "endDate harus lebih besar dari startDate",
        "any.required": "endDate wajib diisi",
    }),
});
/**
 * Validation schema untuk update announcement
 */
exports.updateAnnouncementSchema = joi_1.default.object({
    title: joi_1.default.string().min(3).max(150).optional().messages({
        "string.min": "Judul minimal 3 karakter",
        "string.max": "Judul maksimal 150 karakter",
    }),
    content: joi_1.default.string().min(10).optional().messages({
        "string.min": "Konten minimal 10 karakter",
    }),
    forBranch: joi_1.default.alternatives()
        .try(joi_1.default.number(), joi_1.default.string().pattern(/^\d+$/))
        .optional()
        .allow(null)
        .messages({
        "number.base": "forBranch harus berupa angka",
        "string.pattern.base": "forBranch harus berupa angka",
    }),
    startDate: joi_1.default.date().iso().optional().messages({
        "date.base": "startDate harus berupa tanggal ISO format",
    }),
    endDate: joi_1.default.date().iso().optional().messages({
        "date.base": "endDate harus berupa tanggal ISO format",
    }),
})
    .min(1)
    .messages({
    "object.min": "Minimal ada 1 field yang harus diubah",
});
//# sourceMappingURL=announcementValidation.js.map