import Joi from "joi";

/**
 * Validation schema untuk create branch
 */
const VALID_TIMEZONES = Intl.supportedValuesOf("timeZone");
const facilitiesSchema = Joi.object({
  general: Joi.array().items(Joi.string()).optional().default([]),
  foodAndBeverage: Joi.array().items(Joi.string()).optional().default([]),
  parking: Joi.array().items(Joi.string()).optional().default([]),
  entertainment: Joi.array().items(Joi.string()).optional().default([]),
  accessibility: Joi.array().items(Joi.string()).optional().default([]),
}).options({ allowUnknown: false });

export const createBranchSchema = Joi.object({
  name: Joi.string().min(3).max(120).required().messages({
    "string.min": "Nama cabang minimal 3 karakter",
    "string.max": "Nama cabang maksimal 120 karakter",
    "any.required": "Nama cabang wajib diisi",
  }),
  address: Joi.string().optional().allow(null, ""),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Format nomor telepon tidak valid",
    }),
  timezone: Joi.string()
    .valid(...VALID_TIMEZONES)
    .default("Asia/Jakarta")
    .optional()
    .messages({
      "string.base": "Timezone harus berupa string",
      "any.only": "Timezone tidak valid",
    }),
  openTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
  closeTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
  facilities: facilitiesSchema.optional().messages({
    "object.base": "Facilities harus berupa object",
  }),
});

/**
 * Validation schema untuk update branch
 */
export const updateBranchSchema = Joi.object({
  name: Joi.string().min(3).max(120).optional().messages({
    "string.min": "Nama cabang minimal 3 karakter",
    "string.max": "Nama cabang maksimal 120 karakter",
  }),
  address: Joi.string().optional().allow(null, ""),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Format nomor telepon tidak valid",
    }),
  timezone: Joi.string().optional(),
  openTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
  closeTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
  facilities: facilitiesSchema.optional().messages({
    "object.base": "Facilities harus berupa object",
  }),
});
