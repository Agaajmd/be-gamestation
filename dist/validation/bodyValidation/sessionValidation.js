"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSessionSchema = exports.createSessionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createSessionSchema = joi_1.default.object({
    orderId: joi_1.default.string().required().messages({
        "string.empty": "Order ID tidak boleh kosong",
        "any.required": "Order ID wajib diisi",
    }),
    deviceId: joi_1.default.string().required().messages({
        "string.empty": "Device ID tidak boleh kosong",
        "any.required": "Device ID wajib diisi",
    }),
});
exports.updateSessionSchema = joi_1.default.object({
    status: joi_1.default.string().valid("running", "stopped").required().messages({
        "any.only": "Status harus salah satu dari: running, stopped",
        "any.required": "Status wajib diisi",
    }),
    endedAt: joi_1.default.string().isoDate().optional().messages({
        "string.isoDate": "Format datetime tidak valid",
    }),
});
//# sourceMappingURL=sessionValidation.js.map