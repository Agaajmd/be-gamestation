import Joi from "joi";

/**
 * Validation schema untuk create announcement
 */
export const createAnnouncementSchema = Joi.object({
  imageFile: Joi.string().allow(null, "").messages({
    "string.base": "Announncement image harus berupa string (path/URL)",
  }),
  title: Joi.string().min(3).max(150).required().messages({
    "string.min": "Judul minimal 3 karakter",
    "string.max": "Judul maksimal 150 karakter",
    "any.required": "Judul wajib diisi",
  }),
  description: Joi.string().min(10).required().messages({
    "string.min": "Deskripsi minimal 10 karakter",
    "any.required": "Deskripsi wajib diisi",
  }),
  priority: Joi.string().valid("low", "medium", "high").required().messages({
    "any.only": "Priority harus salah satu dari: low, medium, high",
    "any.required": "Priority wajib diisi",
  }),
  forBranch: Joi.alternatives()
    .try(Joi.number(), Joi.string().pattern(/^\d+$/))
    .optional()
    .messages({
      "number.base": "forBranch harus berupa angka",
      "string.pattern.base": "forBranch harus berupa angka",
    }),
  startDate: Joi.date().iso().required().messages({
    "date.base": "startDate harus berupa tanggal ISO format",
    "any.required": "startDate wajib diisi",
  }),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required().messages({
    "date.base": "endDate harus berupa tanggal ISO format",
    "date.greater": "endDate harus lebih besar dari startDate",
    "any.required": "endDate wajib diisi",
  }),
});

/**
 * Validation schema untuk update announcement
 */
export const updateAnnouncementSchema = Joi.object({
  imageFile: Joi.string().allow(null, "").messages({
    "string.base": "Announncement image harus berupa string (path/URL)",
  }),
  title: Joi.string().min(3).max(150).optional().messages({
    "string.min": "Judul minimal 3 karakter",
    "string.max": "Judul maksimal 150 karakter",
  }),
  content: Joi.string().min(10).optional().messages({
    "string.min": "Konten minimal 10 karakter",
  }),
  forBranch: Joi.alternatives()
    .try(Joi.number(), Joi.string().pattern(/^\d+$/))
    .optional()
    .allow(null)
    .messages({
      "number.base": "forBranch harus berupa angka",
      "string.pattern.base": "forBranch harus berupa angka",
    }),
  startDate: Joi.date().iso().optional().messages({
    "date.base": "startDate harus berupa tanggal ISO format",
  }),
  endDate: Joi.date().iso().optional().messages({
    "date.base": "endDate harus berupa tanggal ISO format",
  }),
})
  .min(1)
  .messages({
    "object.min": "Minimal ada 1 field yang harus diubah",
  });
