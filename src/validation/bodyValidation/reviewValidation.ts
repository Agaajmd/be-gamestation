import Joi from "joi";

export const createReviewSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "string.empty": "Branch ID tidak boleh kosong",
    "any.required": "Branch ID wajib diisi",
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.min": "Rating minimal 1",
    "number.max": "Rating maksimal 5",
    "number.integer": "Rating harus berupa angka integer",
    "any.required": "Rating wajib diisi",
  }),
  comment: Joi.string().optional().allow(""),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional().messages({
    "number.min": "Rating minimal 1",
    "number.max": "Rating maksimal 5",
    "number.integer": "Rating harus berupa angka integer",
  }),
  comment: Joi.string().optional().allow(""),
});
