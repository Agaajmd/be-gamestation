import Joi from "joi";

/**
 * Validation schema untuk add device category
 */
export const addDeviceCategorySchema = Joi.object({
  name: Joi.string().max(50).required().messages({
    "string.max": "Nama kategori maksimal 50 karakter",
    "any.required": "Nama kategori wajib diisi",
  }),
  tier: Joi.string().valid("regular", "vip", "vvip").required().messages({
    "any.only": "Tier harus salah satu dari: regular, vip, vvip",
    "any.required": "Tier wajib diisi",
  }),
  deviceType: Joi.string()
    .valid("ps", "racing", "vr", "pc", "arcade")
    .required()
    .messages({
      "any.only":
        "Device type harus salah satu dari: ps, racing, vr, pc, arcade",
      "any.required": "Device type wajib diisi",
    }),
  description: Joi.string().optional().allow(null),
  pricePerHour: Joi.number().positive().precision(2).required().messages({
    "number.positive": "Harga per jam harus positif",
    "any.required": "Harga per jam wajib diisi",
  }),
  amenities: Joi.array().optional().allow(null),
  isActive: Joi.boolean().optional(),
});

/**
 * Validation schema untuk update device category
 */
export const updateDeviceCategorySchema = Joi.object({
  name: Joi.string().max(50).optional().messages({
    "string.max": "Nama kategori maksimal 50 karakter",
  }),
  tier: Joi.string().valid("regular", "vip", "vvip").optional().messages({
    "any.only": "Tier harus salah satu dari: regular, vip, vvip",
  }),
  deviceType: Joi.string()
    .valid("ps", "racing", "vr", "pc", "arcade")
    .optional()
    .messages({
      "any.only":
        "Device type harus salah satu dari: ps, racing, vr, pc, arcade",
    }),
  description: Joi.string().optional().allow(null),
  pricePerHour: Joi.number().positive().precision(2).optional().messages({
    "number.positive": "Harga per jam harus positif",
  }),
  amenities: Joi.object().optional().allow(null),
  isActive: Joi.boolean().optional(),
});
