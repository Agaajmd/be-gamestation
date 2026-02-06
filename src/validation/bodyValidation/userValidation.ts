import Joi from "joi";

/**
 * Validation schema untuk update user info
 */
export const updateUserInfoSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    "string.email": "Format email tidak valid",
  }),
  fullname: Joi.string().min(3).max(100).optional().messages({
    "string.min": "Nama lengkap minimal 3 karakter",
    "string.max": "Nama lengkap maksimal 100 karakter",
  }),
  phone: Joi.string()
    .pattern(/^[+]?[0-9]{8,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Nomor telepon harus berisi 8-15 digit angka",
    }),
})
  .min(1)
  .messages({
    "object.min":
      "Minimal ada 1 field yang harus diubah (email, fullname, atau phone)",
  });
