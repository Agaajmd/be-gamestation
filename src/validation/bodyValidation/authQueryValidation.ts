import Joi from "joi";

export const verifyEmailSchema = Joi.object({
  key: Joi.string().required().messages({
    "any.required": "Key wajib diisi",
    "string.base": "Key harus berupa string",
  }),
});

export const resendVerificationEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Format email tidak valid",
    "any.required": "Email wajib diisi",
  }),
});

export const checkVerificationStatusSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Format email tidak valid",
    "any.required": "Email wajib diisi",
  }),
});