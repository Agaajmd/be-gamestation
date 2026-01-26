"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.advanceBookingPriceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.advanceBookingPriceSchema = joi_1.default.object({
    branchId: joi_1.default.string().required().messages({
        "string.empty": "Branch ID tidak boleh kosong",
        "any.required": "Branch ID wajib diisi",
    }),
    daysInAdvance: joi_1.default.number().integer().min(1).required().messages({
        "number.base": "Days in advance harus berupa angka",
        "number.integer": "Days in advance harus berupa bilangan bulat",
        "number.min": "Days in advance minimal 1 hari",
        "any.required": "Days in advance wajib diisi",
    }),
    additionalFee: joi_1.default.number().min(0).required().messages({
        "number.base": "Additional fee harus berupa angka",
        "number.min": "Additional fee minimal 0",
        "any.required": "Additional fee wajib diisi",
    }),
});
//# sourceMappingURL=advanceBookingPriceValidation.js.map