"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBranchPaymentMethodSchema = exports.createBranchPaymentMethodSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createBranchPaymentMethodSchema = joi_1.default.object({
    branchId: joi_1.default.string().required().messages({
        "string.empty": "Branch ID tidak boleh kosong",
        "any.required": "Branch ID wajib diisi",
    }),
    method: joi_1.default.string()
        .valid("e_wallet", "bank_transfer", "gateway")
        .required()
        .messages({
        "string.empty": "Payment method tidak boleh kosong",
        "any.only": "Payment method harus: e_wallet, bank_transfer, atau gateway",
        "any.required": "Payment method wajib diisi",
    }),
    provider: joi_1.default.string()
        .valid(
    // E-wallet providers
    "qris", "gopay", "ovo", "dana", "shopeepay", "linkaja", 
    // Bank transfer providers
    "bca", "bri", "bni", "mandiri", "permata", "cimb", 
    // Payment gateway providers
    "midtrans", "xendit", "doku")
        .required()
        .messages({
        "string.empty": "Provider tidak boleh kosong",
        "any.only": "Provider harus salah satu dari: qris, gopay, ovo, dana, shopeepay, linkaja, bca, bri, bni, mandiri, permata, cimb, midtrans, xendit, doku",
        "any.required": "Provider wajib diisi",
    }),
    isActive: joi_1.default.boolean().default(true).messages({
        "boolean.base": "Is active harus berupa boolean",
    }),
    accountNumber: joi_1.default.string().max(255).allow(null, "").messages({
        "string.max": "Nomor rekening maksimal 255 karakter",
    }),
    accountName: joi_1.default.string().max(255).allow(null, "").messages({
        "string.max": "Nama penerima maksimal 255 karakter",
    }),
    qrCodeImage: joi_1.default.string().allow(null, "").messages({
        "string.base": "QR code image harus berupa string (path/URL)",
    }),
    instructions: joi_1.default.string().allow(null, "").messages({
        "string.base": "Instruksi harus berupa text",
    }),
    displayOrder: joi_1.default.number().integer().min(0).default(0).messages({
        "number.base": "Display order harus berupa angka",
        "number.integer": "Display order harus berupa bilangan bulat",
        "number.min": "Display order minimal 0",
    }),
});
exports.updateBranchPaymentMethodSchema = joi_1.default.object({
    method: joi_1.default.string().valid("e_wallet", "bank_transfer", "gateway").messages({
        "string.empty": "Payment method tidak boleh kosong",
        "any.only": "Payment method harus: e_wallet, bank_transfer, atau gateway",
    }),
    provider: joi_1.default.string()
        .valid("qris", "gopay", "ovo", "dana", "shopeepay", "linkaja", "bca", "bri", "bni", "mandiri", "permata", "cimb", "midtrans", "xendit", "doku")
        .messages({
        "string.empty": "Provider tidak boleh kosong",
        "any.only": "Provider harus salah satu dari: qris, gopay, ovo, dana, shopeepay, linkaja, bca, bri, bni, mandiri, permata, cimb, midtrans, xendit, doku",
    }),
    isActive: joi_1.default.boolean().messages({
        "boolean.base": "Is active harus berupa boolean",
    }),
    accountNumber: joi_1.default.string().max(255).allow(null, "").messages({
        "string.max": "Nomor rekening maksimal 255 karakter",
    }),
    accountName: joi_1.default.string().max(255).allow(null, "").messages({
        "string.max": "Nama penerima maksimal 255 karakter",
    }),
    qrCodeImage: joi_1.default.string().allow(null, "").messages({
        "string.base": "QR code image harus berupa string (path/URL)",
    }),
    instructions: joi_1.default.string().allow(null, "").messages({
        "string.base": "Instruksi harus berupa text",
    }),
    displayOrder: joi_1.default.number().integer().min(0).messages({
        "number.base": "Display order harus berupa angka",
        "number.integer": "Display order harus berupa bilangan bulat",
        "number.min": "Display order minimal 0",
    }),
});
//# sourceMappingURL=branchPaymentMethodValidation.js.map