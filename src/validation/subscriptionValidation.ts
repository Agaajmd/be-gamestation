import Joi from "joi";

export const createSubscriptionSchema = Joi.object({
  plan: Joi.string().min(1).max(50).required().messages({
    "string.min": "Plan tidak boleh kosong",
    "string.max": "Plan maksimal 50 karakter",
    "any.required": "Plan wajib diisi",
  }),
  price: Joi.number().positive().required().messages({
    "number.positive": "Price harus lebih dari 0",
    "any.required": "Price wajib diisi",
  }),
  startsAt: Joi.string().isoDate().required().messages({
    "string.isoDate": "Format datetime tidak valid",
    "any.required": "Start date wajib diisi",
  }),
  endsAt: Joi.string().isoDate().required().messages({
    "string.isoDate": "Format datetime tidak valid",
    "any.required": "End date wajib diisi",
  }),
});

export const updateSubscriptionSchema = Joi.object({
  plan: Joi.string().min(1).max(50).optional().messages({
    "string.min": "Plan tidak boleh kosong",
    "string.max": "Plan maksimal 50 karakter",
  }),
  price: Joi.number().positive().optional().messages({
    "number.positive": "Price harus lebih dari 0",
  }),
  startsAt: Joi.string().isoDate().optional().messages({
    "string.isoDate": "Format datetime tidak valid",
  }),
  endsAt: Joi.string().isoDate().optional().messages({
    "string.isoDate": "Format datetime tidak valid",
  }),
  status: Joi.string()
    .valid("active", "expired", "cancelled")
    .optional()
    .messages({
      "any.only": "Status harus salah satu dari: active, expired, cancelled",
    }),
});
