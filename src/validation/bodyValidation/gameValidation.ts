import Joi from "joi";

export const createGameSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.min": "Nama game tidak boleh kosong",
    "string.max": "Nama game maksimal 100 karakter",
    "any.required": "Nama game wajib diisi",
  }),
  deviceType: Joi.string()
    .valid("ps", "pc", "vr", "racing", "arcade")
    .required()
    .messages({
      "any.only": "DeviceType harus salah satu dari: ps, pc, vr, racing, arcade",
      "any.required": "DeviceType wajib diisi",
    }),
});

export const updateGameSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional().messages({
    "string.min": "Nama game minimal 1 karakter",
    "string.max": "Nama game maksimal 100 karakter",
  }),
  deviceType: Joi.string()
    .valid("ps", "pc", "pcvr", "racing")
    .optional()
    .messages({
      "any.only": "DeviceType harus salah satu dari: ps, pc, pcvr, racing",
    }),
});
