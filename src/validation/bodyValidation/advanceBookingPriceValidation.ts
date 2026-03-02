import Joi from "joi";

export const advanceBookingPriceSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "string.empty": "Branch ID tidak boleh kosong",
    "any.required": "Branch ID wajib diisi",
  }),
  minDays: Joi.number().integer().min(1).required().messages({
    "number.base": "Min days harus berupa angka",
    "number.integer": "Min days harus berupa bilangan bulat",
    "number.min": "Min days minimal 1 hari",
    "any.required": "Min days wajib diisi",
  }),
  maxDays: Joi.number()
    .integer()
    .min(Joi.ref("minDays"))
    .allow(null)
    .optional()
    .messages({
      "number.base": "Max days harus berupa angka",
      "number.integer": "Max days harus berupa bilangan bulat",
      "number.min":
        "Max days minimal harus lebih besar atau sama dengan min days",
    }),
  additionalFee: Joi.number().min(0).required().messages({
    "number.base": "Additional fee harus berupa angka",
    "number.min": "Additional fee minimal 0",
    "any.required": "Additional fee wajib diisi",
  }),
});

export const updateAdvanceBookingPriceSchema = Joi.object({
  minDays: Joi.number().integer().min(1).optional().messages({
    "number.base": "Min days harus berupa angka",
    "number.integer": "Min days harus berupa bilangan bulat",
    "number.min": "Min days minimal 1 hari",
  }),
  maxDays: Joi.number().integer().allow(null).optional().messages({
    "number.base": "Max days harus berupa angka",
    "number.integer": "Max days harus berupa bilangan bulat",
  }),
  additionalFee: Joi.number().min(0).optional().messages({
    "number.base": "Additional fee harus berupa angka",
    "number.min": "Additional fee minimal 0",
  }),
});
