import Joi from "joi";

export const createPaymentSchema = Joi.object({
  orderId: Joi.string().required().messages({
    "string.empty": "Order ID tidak boleh kosong",
    "any.required": "Order ID wajib diisi",
  }),
  amount: Joi.number().positive().required().messages({
    "number.positive": "Amount harus lebih dari 0",
    "any.required": "Amount wajib diisi",
  }),
  method: Joi.string()
    .valid("cash", "e_wallet", "bank_transfer", "gateway")
    .required()
    .messages({
      "any.only":
        "Method harus salah satu dari: e_wallet, bank_transfer, gateway",
      "any.required": "Method wajib diisi",
    }),
  provider: Joi.string().optional().allow(""),
  transactionId: Joi.string().optional().allow(""),
  metadata: Joi.object().optional(),
});

export const updatePaymentSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "paid", "failed", "refunded")
    .required()
    .messages({
      "any.only":
        "Status harus salah satu dari: pending, paid, failed, refunded",
      "any.required": "Status wajib diisi",
    }),
  transactionId: Joi.string().optional().allow(""),
  paidAt: Joi.string().isoDate().optional().messages({
    "string.isoDate": "Format datetime tidak valid",
  }),
  metadata: Joi.object().optional(),
});
