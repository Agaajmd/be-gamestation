import Joi from "joi";

/**
 * Validation schema untuk query mendapatkan room dan device yang tersedia
 * Query params: categoryId, bookingDate, startTime, durationMinutes
 */
export const getAvailableRoomsAndDevicesSchema = Joi.object({
  categoryId: Joi.string().required().messages({
    "any.required": "Category ID wajib diisi",
    "string.base": "Category ID harus berupa string",
  }),
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
    "number.base": "Durasi harus berupa angka",
    "number.integer": "Durasi harus angka bulat",
    "number.positive": "Durasi harus lebih dari 0",
    "any.required": "Durasi wajib diisi",
  }),
});

/**
 * Validation schema untuk query mendapatkan available times
 * Query params: categoryId, bookingDate, durationMinutes
 */
export const getAvailableTimesSchema = Joi.object({
  categoryId: Joi.string().required().messages({
    "any.required": "Category ID wajib diisi",
  }),
  bookingDate: Joi.string().isoDate().required().messages({
    "string.isoDate": "Format tanggal tidak valid (gunakan YYYY-MM-DD)",
    "any.required": "Tanggal booking wajib diisi",
  }),
  durationMinutes: Joi.number().integer().positive().required().messages({
    "number.base": "Durasi harus berupa angka",
    "number.integer": "Durasi harus angka bulat",
    "number.positive": "Durasi harus lebih dari 0",
    "any.required": "Durasi wajib diisi",
  }),
});

/**
 * Validation schema untuk query mendapatkan available dates
 * Query params: startDate, endDate
 */
export const getAvailableDatesSchema = Joi.object({
  startDate: Joi.string().isoDate().required().messages({
    "string.isoDate": "Format tanggal tidak valid (gunakan YYYY-MM-DD)",
    "any.required": "Start date wajib diisi",
  }),
  endDate: Joi.string().isoDate().required().messages({
    "string.isoDate": "Format tanggal tidak valid (gunakan YYYY-MM-DD)",
    "any.required": "End date wajib diisi",
  }),
});
