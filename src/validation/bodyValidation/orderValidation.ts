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
  paymentId: Joi.string().required().messages({
    "string.empty": "Payment ID tidak boleh kosong",
    "any.required": "Payment ID wajib diisi",
  }),
});

export const updateOrderStatusSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "string.empty": "Branch ID tidak boleh kosong",
    "any.required": "Branch ID wajib diisi",
  }),
  orderStatus: Joi.string()
    .valid("pending", "confirmed", "completed", "canceled")
    .required()
    .messages({
      "any.only": "Status tidak valid",
      "any.required": "Status wajib diisi",
    }),
  paymentStatus: Joi.string()
    .valid("unpaid", "paid", "failed", "refund_pending")
    .optional()
    .messages({
      "any.only": "Payment status tidak valid",
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

export const createCustomOrderSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "string.empty": "Branch ID tidak boleh kosong",
    "any.required": "Branch ID wajib diisi",
  }),
  customerId: Joi.string().optional().allow(null),
  guestCustomerName: Joi.string().when("customerId", {
    is: Joi.exist().allow(null),
    then: Joi.string().min(3).required().messages({
      "string.min": "Nama customer minimal 3 karakter",
      "any.required": "Nama customer wajib diisi jika tidak punya akun",
    }),
    otherwise: Joi.optional(),
  }),
  guestCustomerPhone: Joi.string().when("customerId", {
    is: Joi.exist().allow(null),
    then: Joi.string()
      .pattern(/^(\+62|62|0)[0-9]{9,12}$/)
      .required()
      .messages({
        "string.pattern.base": "Format nomor telepon tidak valid",
        "any.required": "Nomor telepon wajib diisi jika tidak punya akun",
      }),
    otherwise: Joi.optional(),
  }),
  guestCustomerEmail: Joi.string().optional().allow(null),
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
  startTime: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Format waktu harus HH:mm",
      "any.required": "Waktu mulai wajib diisi",
    }),
  notes: Joi.string().optional().allow(""),
});
