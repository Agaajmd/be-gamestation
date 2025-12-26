"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentSchema = exports.createPaymentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createPaymentSchema = joi_1.default.object({
    orderId: joi_1.default.string().required().messages({
        "string.empty": "Order ID tidak boleh kosong",
        "any.required": "Order ID wajib diisi",
    }),
    amount: joi_1.default.number().positive().required().messages({
        "number.positive": "Amount harus lebih dari 0",
        "any.required": "Amount wajib diisi",
    }),
    method: joi_1.default.string()
        .valid("e_wallet", "bank_transfer", "gateway")
        .required()
        .messages({
        "any.only": "Method harus salah satu dari: e_wallet, bank_transfer, gateway",
        "any.required": "Method wajib diisi",
    }),
    provider: joi_1.default.string().optional().allow(""),
    transactionId: joi_1.default.string().optional().allow(""),
    metadata: joi_1.default.object().optional(),
});
exports.updatePaymentSchema = joi_1.default.object({
    status: joi_1.default.string()
        .valid("pending", "paid", "failed", "refunded")
        .required()
        .messages({
        "any.only": "Status harus salah satu dari: pending, paid, failed, refunded",
        "any.required": "Status wajib diisi",
    }),
    transactionId: joi_1.default.string().optional().allow(""),
    paidAt: joi_1.default.string().isoDate().optional().messages({
        "string.isoDate": "Format datetime tidak valid",
    }),
    metadata: joi_1.default.object().optional(),
});
//# sourceMappingURL=paymentValidation.js.map