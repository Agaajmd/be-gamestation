import Joi from "joi";

export const createBranchPaymentMethodSchema = Joi.object({
  branchId: Joi.string().required().messages({
    "string.empty": "Branch ID tidak boleh kosong",
    "any.required": "Branch ID wajib diisi",
  }),
  method: Joi.string()
    .valid("cash", "e_wallet", "bank_transfer", "gateway")
    .required()
    .messages({
      "string.empty": "Payment method tidak boleh kosong",
      "any.only": "Payment method harus: e_wallet, bank_transfer, atau gateway",
      "any.required": "Payment method wajib diisi",
    }),
  provider: Joi.string()
    .valid(
      // E-wallet providers
      "qris",
      "gopay",
      "ovo",
      "dana",
      "shopeepay",
      "linkaja",
      // Bank transfer providers
      "bca",
      "bri",
      "bni",
      "mandiri",
      "permata",
      "cimb",
      // Payment gateway providers
      "midtrans",
      "xendit",
      "doku",
    )
    .optional()
    .allow("")
    .messages({
      "any.only":
        "Provider harus salah satu dari: qris, gopay, ovo, dana, shopeepay, linkaja, bca, bri, bni, mandiri, permata, cimb, midtrans, xendit, doku",
    }),
  isActive: Joi.boolean().default(true).messages({
    "boolean.base": "Is active harus berupa boolean",
  }),
  accountNumber: Joi.string().max(255).allow(null, "").messages({
    "string.max": "Nomor rekening maksimal 255 karakter",
  }),
  accountName: Joi.string().max(255).allow(null, "").messages({
    "string.max": "Nama penerima maksimal 255 karakter",
  }),
  qrCodeImage: Joi.string().allow(null, "").messages({
    "string.base": "QR code image harus berupa string (path/URL)",
  }),
  instructions: Joi.string().allow(null, "").messages({
    "string.base": "Instruksi harus berupa text",
  }),
  displayOrder: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Display order harus berupa angka",
    "number.integer": "Display order harus berupa bilangan bulat",
    "number.min": "Display order minimal 0",
  }),
});

export const updateBranchPaymentMethodSchema = Joi.object({
  method: Joi.string().valid("e_wallet", "bank_transfer", "gateway").messages({
    "string.empty": "Payment method tidak boleh kosong",
    "any.only": "Payment method harus: e_wallet, bank_transfer, atau gateway",
  }),
  provider: Joi.string()
    .valid(
      "qris",
      "gopay",
      "ovo",
      "dana",
      "shopeepay",
      "linkaja",
      "bca",
      "bri",
      "bni",
      "mandiri",
      "permata",
      "cimb",
      "midtrans",
      "xendit",
      "doku",
    )
    .messages({
      "string.empty": "Provider tidak boleh kosong",
      "any.only":
        "Provider harus salah satu dari: qris, gopay, ovo, dana, shopeepay, linkaja, bca, bri, bni, mandiri, permata, cimb, midtrans, xendit, doku",
    }),
  isActive: Joi.boolean().messages({
    "boolean.base": "Is active harus berupa boolean",
  }),
  accountNumber: Joi.string().max(255).allow(null, "").messages({
    "string.max": "Nomor rekening maksimal 255 karakter",
  }),
  accountName: Joi.string().max(255).allow(null, "").messages({
    "string.max": "Nama penerima maksimal 255 karakter",
  }),
  qrCodeImage: Joi.string().allow(null, "").messages({
    "string.base": "QR code image harus berupa string (path/URL)",
  }),
  instructions: Joi.string().allow(null, "").messages({
    "string.base": "Instruksi harus berupa text",
  }),
  displayOrder: Joi.number().integer().min(0).messages({
    "number.base": "Display order harus berupa angka",
    "number.integer": "Display order harus berupa bilangan bulat",
    "number.min": "Display order minimal 0",
  }),
});
