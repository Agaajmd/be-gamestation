import Joi from "joi";

/**
 * Validation schema untuk calculate booking price
 */
export const calculateBookingPriceSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "any.required": "Branch ID wajib diisi",
  }),
  deviceId: Joi.string().required().messages({
    "any.required": "Device ID wajib diisi",
  }),
  categoryId: Joi.string().optional().allow(null),
  bookingDate: Joi.string().isoDate().required().messages({
    "string.isoDate": "Format tanggal tidak valid (gunakan YYYY-MM-DD)",
    "any.required": "Tanggal booking wajib diisi",
  }),
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "Format waktu tidak valid (gunakan HH:mm)",
      "any.required": "Waktu mulai wajib diisi",
    }),
  durationMinutes: Joi.number().integer().positive().required().messages({
    "number.integer": "Durasi harus angka bulat",
    "number.positive": "Durasi harus positif",
    "any.required": "Durasi wajib diisi",
  }),
});
