import Joi from "joi";

export const createOrderSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "string.empty": "Branch ID tidak boleh kosong",
    "any.required": "Branch ID wajib diisi",
  }),
  roomAndDeviceId: Joi.string().required().messages({
    "string.empty": "RoomAndDevice ID tidak boleh kosong",
    "any.required": "RoomAndDevice ID wajib diisi",
  }),
  categoryId: Joi.string().optional().allow(null),
  durationMinutes: Joi.number().integer().min(30).required().messages({
    "number.base": "Duration harus berupa angka",
    "number.integer": "Duration harus berupa bilangan bulat",
    "number.min": "Duration minimal 30 menit",
    "any.required": "Duration wajib diisi",
  }),
  bookingDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Format tanggal harus YYYY-MM-DD",
      "any.required": "Tanggal booking wajib diisi",
    }),
  startTime: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Format waktu harus HH:mm",
      "any.required": "Waktu mulai wajib diisi",
    }),
  notes: Joi.string().optional().allow(""),
});

export const checkoutOrderSchema = Joi.object({
  paymentMethod: Joi.string()
    .valid("credit_card", "debit_card", "cash", "e_wallet")
    .required()
    .messages({
      "any.only": "Metode pembayaran tidak valid",
      "any.required": "Metode pembayaran wajib diisi",
    }),
});

export const updateOrderStatusSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "string.empty": "Branch ID tidak boleh kosong",
    "any.required": "Branch ID wajib diisi",
  }),
  status: Joi.string()
    .valid("pending", "confirmed", "completed", "canceled")
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
