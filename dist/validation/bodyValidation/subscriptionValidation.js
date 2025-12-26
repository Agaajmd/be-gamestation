"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscriptionSchema = exports.createSubscriptionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createSubscriptionSchema = joi_1.default.object({
    plan: joi_1.default.string().min(1).max(50).required().messages({
        "string.min": "Plan tidak boleh kosong",
        "string.max": "Plan maksimal 50 karakter",
        "any.required": "Plan wajib diisi",
    }),
    price: joi_1.default.number().positive().required().messages({
        "number.positive": "Price harus lebih dari 0",
        "any.required": "Price wajib diisi",
    }),
    startsAt: joi_1.default.string().isoDate().required().messages({
        "string.isoDate": "Format datetime tidak valid",
        "any.required": "Start date wajib diisi",
    }),
    endsAt: joi_1.default.string().isoDate().required().messages({
        "string.isoDate": "Format datetime tidak valid",
        "any.required": "End date wajib diisi",
    }),
});
exports.updateSubscriptionSchema = joi_1.default.object({
    plan: joi_1.default.string().min(1).max(50).optional().messages({
        "string.min": "Plan tidak boleh kosong",
        "string.max": "Plan maksimal 50 karakter",
    }),
    price: joi_1.default.number().positive().optional().messages({
        "number.positive": "Price harus lebih dari 0",
    }),
    startsAt: joi_1.default.string().isoDate().optional().messages({
        "string.isoDate": "Format datetime tidak valid",
    }),
    endsAt: joi_1.default.string().isoDate().optional().messages({
        "string.isoDate": "Format datetime tidak valid",
    }),
    status: joi_1.default.string()
        .valid("active", "expired", "cancelled")
        .optional()
        .messages({
        "any.only": "Status harus salah satu dari: active, expired, cancelled",
    }),
});
//# sourceMappingURL=subscriptionValidation.js.map