"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatusSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createOrderSchema = joi_1.default.object({
    branchId: joi_1.default.string().required().messages({
        "string.empty": "Branch ID tidak boleh kosong",
        "any.required": "Branch ID wajib diisi",
    }),
    deviceId: joi_1.default.string().required().messages({
        "string.empty": "Device ID tidak boleh kosong",
        "any.required": "Device ID wajib diisi",
    }),
    categoryId: joi_1.default.string().optional().allow(null),
    packageId: joi_1.default.string().required().messages({
        "string.empty": "Package ID tidak boleh kosong",
        "any.required": "Package ID wajib diisi",
    }),
    gameId: joi_1.default.string().optional().allow(null),
    bookingStart: joi_1.default.string().isoDate().required().messages({
        "string.isoDate": "Format datetime tidak valid",
        "any.required": "Waktu mulai booking wajib diisi",
    }),
    bookingEnd: joi_1.default.string().isoDate().required().messages({
        "string.isoDate": "Format datetime tidak valid",
        "any.required": "Waktu selesai booking wajib diisi",
    }),
    paymentMethod: joi_1.default.string()
        .valid("e_wallet", "bank_transfer", "gateway")
        .optional()
        .messages({
        "any.only": "Payment method harus salah satu dari: e_wallet, bank_transfer, gateway",
    }),
    notes: joi_1.default.string().optional().allow(""),
});
exports.updateOrderStatusSchema = joi_1.default.object({
    status: joi_1.default.string()
        .valid("pending", "paid", "cancelled", "checked_in", "completed", "no_show", "refunded")
        .required()
        .messages({
        "any.only": "Status tidak valid",
        "any.required": "Status wajib diisi",
    }),
});
exports.updatePaymentStatusSchema = joi_1.default.object({
    paymentStatus: joi_1.default.string()
        .valid("unpaid", "paid", "failed", "refund_pending")
        .required()
        .messages({
        "any.only": "Payment status tidak valid",
        "any.required": "Payment status wajib diisi",
    }),
});
//# sourceMappingURL=orderValidation.js.map