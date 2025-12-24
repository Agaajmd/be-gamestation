import Joi from "joi";

/**
 * Validation schema untuk add category
 */
export const addCategorySchema = Joi.object({
  name: Joi.string().max(50).required().messages({
    "string.max": "Nama kategori maksimal 50 karakter",
    "any.required": "Nama kategori wajib diisi",
  }),
  description: Joi.string().max(255).optional().allow(null).messages({
    "string.max": "Deskripsi kategori maksimal 255 karakter",
  }),
  tier: Joi.string().valid("regular", "vip", "vvip").required().messages({
    "any.only": "Tier harus salah satu dari: regular, vip, vvip",
    "any.required": "Tier wajib diisi",
  }),
  pricePerHour: Joi.number().positive().precision(2).required().messages({
    "number.positive": "Harga per jam harus positif",
    "any.required": "Harga per jam wajib diisi",
  }),
  amenities: Joi.array().optional().allow(null),
});

/**
 * Validation schema untuk update category
 */
export const updateCategorySchema = Joi.object({
  name: Joi.string().max(50).optional().messages({
    "string.max": "Nama kategori maksimal 50 karakter",
  }),
  description: Joi.string().max(255).optional().allow(null).messages({
    "string.max": "Deskripsi kategori maksimal 255 karakter",
  }),
  tier: Joi.string().valid("regular", "vip", "vvip").optional().messages({
    "any.only": "Tier harus salah satu dari: regular, vip, vvip",
  }),
  pricePerHour: Joi.number().positive().precision(2).optional().messages({
    "number.positive": "Harga per jam harus positif",
  }),
  amenities: Joi.array().optional().allow(null),
});