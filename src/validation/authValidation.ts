import Joi from "joi";

/**
 * Validation schema untuk register
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Format email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "Password minimal 6 karakter",
  }),
  fullname: Joi.string().min(3).max(100).required().messages({
    "string.min": "Nama lengkap minimal 3 karakter",
    "string.max": "Nama lengkap maksimal 100 karakter",
    "any.required": "Nama lengkap wajib diisi",
  }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .required()
    .messages({
      "string.pattern.base": "Format nomor telepon tidak valid",
    }),
});

/**
 * Validation schema untuk login
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Format email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password wajib diisi",
  }),
});

/**
 * Validation schema untuk login OTP
 */
export const loginOTPSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Format email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .optional()
    .messages({
      "string.length": "OTP harus 6 digit",
      "string.pattern.base": "OTP harus berupa angka",
    }),
});

/**
 * Validation schema untuk refresh token
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token wajib diisi",
  }),
});
