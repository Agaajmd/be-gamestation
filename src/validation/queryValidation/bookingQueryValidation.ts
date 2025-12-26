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
 * Query params: branchId, month
 */
export const getAvailableDatesSchema = Joi.object({
  month: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
    .required()
    .messages({
      "string.pattern.base": "Format bulan tidak valid (gunakan YYYY-MM)",
      "any.required": "Bulan wajib diisi",
    }),
});
