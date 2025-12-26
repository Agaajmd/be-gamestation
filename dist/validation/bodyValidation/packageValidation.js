"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPackageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema untuk add package
 */
exports.addPackageSchema = joi_1.default.object({
    name: joi_1.default.string().max(50).required().messages({
        "string.max": "Nama paket maksimal 50 karakter",
        "any.required": "Nama paket wajib diisi",
    }),
    durationMinutes: joi_1.default.number().integer().min(1).required().messages({
        "number.min": "Durasi minimal 1 menit",
        "any.required": "Durasi wajib diisi",
    }),
    price: joi_1.default.number().positive().required().messages({
        "number.positive": "Harga harus lebih dari 0",
        "any.required": "Harga wajib diisi",
    }),
    isActive: joi_1.default.boolean().optional(),
});
//# sourceMappingURL=packageValidation.js.map