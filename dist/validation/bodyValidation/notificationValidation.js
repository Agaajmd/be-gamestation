"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationStatusSchema = exports.createNotificationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createNotificationSchema = joi_1.default.object({
    userId: joi_1.default.string().required().messages({
        "string.empty": "User ID tidak boleh kosong",
        "any.required": "User ID wajib diisi",
    }),
    type: joi_1.default.string().min(1).max(50).required().messages({
        "string.min": "Type tidak boleh kosong",
        "string.max": "Type maksimal 50 karakter",
        "any.required": "Type wajib diisi",
    }),
    channel: joi_1.default.string().valid("push", "email", "sms").required().messages({
        "any.only": "Channel harus salah satu dari: push, email, sms",
        "any.required": "Channel wajib diisi",
    }),
    payload: joi_1.default.object().required().messages({
        "any.required": "Payload wajib diisi",
    }),
});
exports.updateNotificationStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid("pending", "sent", "failed").required().messages({
        "any.only": "Status harus salah satu dari: pending, sent, failed",
        "any.required": "Status wajib diisi",
    }),
});
//# sourceMappingURL=notificationValidation.js.map