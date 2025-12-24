import Joi from "joi";

export const createNotificationSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.empty": "User ID tidak boleh kosong",
    "any.required": "User ID wajib diisi",
  }),
  type: Joi.string().min(1).max(50).required().messages({
    "string.min": "Type tidak boleh kosong",
    "string.max": "Type maksimal 50 karakter",
    "any.required": "Type wajib diisi",
  }),
  channel: Joi.string().valid("push", "email", "sms").required().messages({
    "any.only": "Channel harus salah satu dari: push, email, sms",
    "any.required": "Channel wajib diisi",
  }),
  payload: Joi.object().required().messages({
    "any.required": "Payload wajib diisi",
  }),
});

export const updateNotificationStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "sent", "failed").required().messages({
    "any.only": "Status harus salah satu dari: pending, sent, failed",
    "any.required": "Status wajib diisi",
  }),
});
