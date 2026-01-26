"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGameSchema = exports.createGameSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createGameSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).max(100).required().messages({
        "string.min": "Nama game tidak boleh kosong",
        "string.max": "Nama game maksimal 100 karakter",
        "any.required": "Nama game wajib diisi",
    }),
    deviceType: joi_1.default.string()
        .valid("ps", "pc", "vr", "racing", "arcade")
        .required()
        .messages({
        "any.only": "DeviceType harus salah satu dari: ps, pc, vr, racing, arcade",
        "any.required": "DeviceType wajib diisi",
    }),
});
exports.updateGameSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).max(100).optional().messages({
        "string.min": "Nama game minimal 1 karakter",
        "string.max": "Nama game maksimal 100 karakter",
    }),
    deviceType: joi_1.default.string()
        .valid("ps", "pc", "pcvr", "racing")
        .optional()
        .messages({
        "any.only": "DeviceType harus salah satu dari: ps, pc, pcvr, racing",
    }),
});
//# sourceMappingURL=gameValidation.js.map