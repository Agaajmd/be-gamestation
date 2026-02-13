"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatusSchema = exports.updateOrderStatusSchema = exports.checkoutOrderSchema = exports.createOrderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createOrderSchema = joi_1.default.object({
    branchId: joi_1.default.string().required().messages({
        "string.empty": "Branch ID tidak boleh kosong",
        "any.required": "Branch ID wajib diisi",
    }),
    roomAndDeviceId: joi_1.default.string().required().messages({
        "string.empty": "RoomAndDevice ID tidak boleh kosong",
        "any.required": "RoomAndDevice ID wajib diisi",
    }),
    categoryId: joi_1.default.string().optional().allow(null),
    durationMinutes: joi_1.default.number().integer().min(30).required().messages({
        "number.base": "Duration harus berupa angka",
        "number.integer": "Duration harus berupa bilangan bulat",
        "number.min": "Duration minimal 30 menit",
        "any.required": "Duration wajib diisi",
    }),
    bookingDate: joi_1.default.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
        "string.pattern.base": "Format tanggal harus YYYY-MM-DD",
        "any.required": "Tanggal booking wajib diisi",
    }),
    startTime: joi_1.default.string()
        .pattern(/^\d{2}:\d{2}$/)
        .required()
        .messages({
        "string.pattern.base": "Format waktu harus HH:mm",
        "any.required": "Waktu mulai wajib diisi",
    }),
    notes: joi_1.default.string().optional().allow(""),
});
exports.checkoutOrderSchema = joi_1.default.object({
    paymentId: joi_1.default.string().required().messages({
        "string.empty": "Payment ID tidak boleh kosong",
        "any.required": "Payment ID wajib diisi",
    }),
});
exports.updateOrderStatusSchema = joi_1.default.object({
    branchId: joi_1.default.string().required().messages({
        "string.empty": "Branch ID tidak boleh kosong",
        "any.required": "Branch ID wajib diisi",
    }),
    orderStatus: joi_1.default.string()
        .valid("pending", "confirmed", "completed", "canceled")
        .required()
        .messages({
        "any.only": "Status tidak valid",
        "any.required": "Status wajib diisi",
    }),
    paymentStatus: joi_1.default.string()
        .valid("unpaid", "paid", "failed", "refund_pending")
        .optional()
        .messages({
        "any.only": "Payment status tidak valid",
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