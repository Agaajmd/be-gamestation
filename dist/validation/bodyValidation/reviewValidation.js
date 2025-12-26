"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewSchema = exports.createReviewSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createReviewSchema = joi_1.default.object({
    orderId: joi_1.default.string().required().messages({
        "string.empty": "Order ID tidak boleh kosong",
        "any.required": "Order ID wajib diisi",
    }),
    rating: joi_1.default.number().integer().min(1).max(5).required().messages({
        "number.min": "Rating minimal 1",
        "number.max": "Rating maksimal 5",
        "number.integer": "Rating harus berupa angka integer",
        "any.required": "Rating wajib diisi",
    }),
    comment: joi_1.default.string().optional().allow(""),
});
exports.updateReviewSchema = joi_1.default.object({
    rating: joi_1.default.number().integer().min(1).max(5).optional().messages({
        "number.min": "Rating minimal 1",
        "number.max": "Rating maksimal 5",
        "number.integer": "Rating harus berupa angka integer",
    }),
    comment: joi_1.default.string().optional().allow(""),
});
//# sourceMappingURL=reviewValidation.js.map