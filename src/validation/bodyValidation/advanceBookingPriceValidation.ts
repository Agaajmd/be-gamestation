import Joi from "joi";

export const advanceBookingPriceSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "string.empty": "Branch ID tidak boleh kosong",
    "any.required": "Branch ID wajib diisi",
  }),
  daysInAdvance: Joi.number().integer().min(1).required().messages({
    "number.base": "Days in advance harus berupa angka",
    "number.integer": "Days in advance harus berupa bilangan bulat",
    "number.min": "Days in advance minimal 1 hari",
    "any.required": "Days in advance wajib diisi",
  }),
  additionalFee: Joi.number().min(0).required().messages({
    "number.base": "Additional fee harus berupa angka",
    "number.min": "Additional fee minimal 0",
    "any.required": "Additional fee wajib diisi",
  }),
});
