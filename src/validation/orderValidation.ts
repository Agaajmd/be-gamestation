import Joi from "joi";

export const createOrderSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "string.empty": "Branch ID tidak boleh kosong",
    "any.required": "Branch ID wajib diisi",
  }),
  deviceId: Joi.string().required().messages({
    "string.empty": "Device ID tidak boleh kosong",
    "any.required": "Device ID wajib diisi",
  }),
  categoryId: Joi.string().optional().allow(null),
  packageId: Joi.string().required().messages({
    "string.empty": "Package ID tidak boleh kosong",
    "any.required": "Package ID wajib diisi",
  }),
  gameId: Joi.string().optional().allow(null),
  bookingStart: Joi.string().isoDate().required().messages({
    "string.isoDate": "Format datetime tidak valid",
    "any.required": "Waktu mulai booking wajib diisi",
  }),
  bookingEnd: Joi.string().isoDate().required().messages({
    "string.isoDate": "Format datetime tidak valid",
    "any.required": "Waktu selesai booking wajib diisi",
  }),
  paymentMethod: Joi.string()
    .valid("e_wallet", "bank_transfer", "gateway")
    .optional()
    .messages({
      "any.only":
        "Payment method harus salah satu dari: e_wallet, bank_transfer, gateway",
    }),
  notes: Joi.string().optional().allow(""),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "pending",
      "paid",
      "cancelled",
      "checked_in",
      "completed",
      "no_show",
      "refunded"
    )
    .required()
    .messages({
      "any.only": "Status tidak valid",
      "any.required": "Status wajib diisi",
    }),
});

export const updatePaymentStatusSchema = Joi.object({
  paymentStatus: Joi.string()
    .valid("unpaid", "paid", "failed", "refund_pending")
    .required()
    .messages({
      "any.only": "Payment status tidak valid",
      "any.required": "Payment status wajib diisi",
    }),
});
