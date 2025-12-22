import Joi from "joi";


/**
 * Validation schema untuk add package
 */
export const addPackageSchema = Joi.object({
  name: Joi.string().max(50).required().messages({
    "string.max": "Nama paket maksimal 50 karakter",
    "any.required": "Nama paket wajib diisi",
  }),
  durationMinutes: Joi.number().integer().min(1).required().messages({
    "number.min": "Durasi minimal 1 menit",
    "any.required": "Durasi wajib diisi",
  }),
  price: Joi.number().positive().required().messages({
    "number.positive": "Harga harus lebih dari 0",
    "any.required": "Harga wajib diisi",
  }),
  isActive: Joi.boolean().optional(),
});