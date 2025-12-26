"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomAndDeviceSchema = exports.addRoomAndDeviceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema untuk add room and device
 */
exports.addRoomAndDeviceSchema = joi_1.default.object({
    categoryId: joi_1.default.string().optional().allow(null).messages({
        "string.base": "Kategori device harus berupa string",
    }),
    name: joi_1.default.string().max(50).required().messages({
        "string.max": "Nama device maksimal 50 karakter",
        "any.required": "Nama device wajib diisi",
    }),
    deviceType: joi_1.default.string()
        .valid("ps", "racing", "vr", "pc", "arcade")
        .required()
        .messages({
        "any.only": "Type harus salah satu dari: ps, racing, vr, pc, arcade",
        "any.required": "Type device wajib diisi",
    }),
    version: joi_1.default.string()
        .valid("ps4", "ps5", "racing_standard", "racing_pro", "vr_meta", "vr_pico", "pc_standard", "pc_gaming", "arcade_standard")
        .required()
        .allow(null)
        .messages({
        "any.only": "Version harus salah satu dari: ps4, ps5, racing_standard, racing_pro, vr_meta, vr_pico, pc_standard, pc_gaming, arcade_standard",
        "any.required": "Version device wajib diisi",
    }),
    pricePerHour: joi_1.default.number().positive().precision(2).required().messages({
        "number.positive": "Harga per jam harus positif",
        "any.required": "Harga per jam wajib diisi",
    }),
    roomNumber: joi_1.default.string().max(20).optional().allow(null).messages({
        "string.max": "Nomor ruangan maksimal 20 karakter",
    }),
    status: joi_1.default.string()
        .valid("available", "maintenance", "in_use")
        .optional()
        .messages({
        "any.only": "Status harus salah satu dari: available, maintenance, in_use",
    }),
});
/**
 * Validation schema untuk update device
 */
exports.updateRoomAndDeviceSchema = joi_1.default.object({
    categoryId: joi_1.default.string().optional().allow(null),
    code: joi_1.default.string().max(32).optional().allow(null).messages({
        "string.max": "Kode device maksimal 32 karakter",
    }),
    name: joi_1.default.string().max(50).optional().messages({
        "string.max": "Nama device maksimal 50 karakter",
    }),
    deviceType: joi_1.default.string()
        .valid("ps", "racing", "vr", "pc", "arcade")
        .optional()
        .messages({
        "any.only": "Type harus salah satu dari: ps, racing, vr, pc, arcade",
    }),
    version: joi_1.default.string()
        .valid("ps4", "ps5", "racing_standard", "racing_pro", "vr_meta", "vr_pico", "pc_standard", "pc_gaming", "arcade_standard")
        .optional()
        .allow(null)
        .messages({
        "any.only": "Version tidak valid",
    }),
    pricePerHour: joi_1.default.number().positive().precision(2).optional().messages({
        "number.positive": "Harga per jam harus positif",
    }),
    roomNumber: joi_1.default.string().max(20).optional().allow(null).messages({
        "string.max": "Nomor ruangan maksimal 20 karakter",
    }),
    status: joi_1.default.string()
        .valid("available", "maintenance", "inused")
        .optional()
        .messages({
        "any.only": "Status harus salah satu dari: available, maintenance, inused",
    }),
    isActive: joi_1.default.boolean().optional().messages({
        "boolean.base": "Status aktif harus berupa boolean",
    }),
});
//# sourceMappingURL=roomAndDeviceValidation.js.map