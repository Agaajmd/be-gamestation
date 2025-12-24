import Joi from "joi";

export const createSessionSchema = Joi.object({
  orderId: Joi.string().required().messages({
    "string.empty": "Order ID tidak boleh kosong",
    "any.required": "Order ID wajib diisi",
  }),
  deviceId: Joi.string().required().messages({
    "string.empty": "Device ID tidak boleh kosong",
    "any.required": "Device ID wajib diisi",
  }),
});

export const updateSessionSchema = Joi.object({
  status: Joi.string().valid("running", "stopped").required().messages({
    "any.only": "Status harus salah satu dari: running, stopped",
    "any.required": "Status wajib diisi",
  }),
  endedAt: Joi.string().isoDate().optional().messages({
    "string.isoDate": "Format datetime tidak valid",
  }),
});
