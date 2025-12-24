import Joi from "joi";

/**
 * Validation schema untuk add room and device
 */
export const addRoomAndDeviceSchema = Joi.object({
  categoryId: Joi.string().optional().allow(null).messages({
    "string.base": "Kategori device harus berupa string",
  }),
  name: Joi.string().max(50).required().messages({
    "string.max": "Nama device maksimal 50 karakter",
    "any.required": "Nama device wajib diisi",
  }),
  deviceType: Joi.string()
    .valid("ps", "racing", "vr", "pc", "arcade")
    .required()
    .messages({
      "any.only": "Type harus salah satu dari: ps, racing, vr, pc, arcade",
      "any.required": "Type device wajib diisi",
    }),
  version: Joi.string()
    .valid(
      "ps4",
      "ps5",
      "racing_standard",
      "racing_pro",
      "vr_meta",
      "vr_pico",
      "pc_standard",
      "pc_gaming",
      "arcade_standard"
    )
    .required()
    .allow(null)
    .messages({
      "any.only":
        "Version harus salah satu dari: ps4, ps5, racing_standard, racing_pro, vr_meta, vr_pico, pc_standard, pc_gaming, arcade_standard",
      "any.required": "Version device wajib diisi",
    }),
  pricePerHour: Joi.number().positive().precision(2).required().messages({
    "number.positive": "Harga per jam harus positif",
    "any.required": "Harga per jam wajib diisi",
  }),
  roomNumber: Joi.string().max(20).optional().allow(null).messages({
    "string.max": "Nomor ruangan maksimal 20 karakter",
  }),
  status: Joi.string()
    .valid("available", "maintenance", "in_use")
    .optional()
    .messages({
      "any.only":
        "Status harus salah satu dari: available, maintenance, in_use",
    }),
});

/**
 * Validation schema untuk update device
 */
export const updateRoomAndDeviceSchema = Joi.object({
  categoryId: Joi.string().optional().allow(null),
  code: Joi.string().max(32).optional().allow(null).messages({
    "string.max": "Kode device maksimal 32 karakter",
  }),
  name: Joi.string().max(50).optional().messages({
    "string.max": "Nama device maksimal 50 karakter",
  }),
  deviceType: Joi.string()
    .valid("ps", "racing", "vr", "pc", "arcade")
    .optional()
    .messages({
      "any.only": "Type harus salah satu dari: ps, racing, vr, pc, arcade",
    }),
  version: Joi.string()
    .valid(
      "ps4",
      "ps5",
      "racing_standard",
      "racing_pro",
      "vr_meta",
      "vr_pico",
      "pc_standard",
      "pc_gaming",
      "arcade_standard"
    )
    .optional()
    .allow(null)
    .messages({
      "any.only": "Version tidak valid",
    }),
  pricePerHour: Joi.number().positive().precision(2).optional().messages({
    "number.positive": "Harga per jam harus positif",
  }),
  roomNumber: Joi.string().max(20).optional().allow(null).messages({
    "string.max": "Nomor ruangan maksimal 20 karakter",
  }),
  status: Joi.string()
    .valid("available", "maintenance", "inused")
    .optional()
    .messages({
      "any.only":
        "Status harus salah satu dari: available, maintenance, inused",
    }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "Status aktif harus berupa boolean",
  }),
});
