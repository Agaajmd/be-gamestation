import Joi from "joi";

/**
 * Validation schema untuk create branch
 */
export const createBranchSchema = Joi.object({
  name: Joi.string().min(3).max(120).required().messages({
    "string.min": "Nama cabang minimal 3 karakter",
    "string.max": "Nama cabang maksimal 120 karakter",
    "any.required": "Nama cabang wajib diisi",
  }),
  address: Joi.string().optional().allow(null, ""),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Format nomor telepon tidak valid",
    }),
  timezone: Joi.string().optional().messages({
    "string.base": "Timezone harus berupa string",
  }),
  openTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
  closeTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
});

/**
 * Validation schema untuk update branch
 */
export const updateBranchSchema = Joi.object({
  name: Joi.string().min(3).max(120).optional().messages({
    "string.min": "Nama cabang minimal 3 karakter",
    "string.max": "Nama cabang maksimal 120 karakter",
  }),
  address: Joi.string().optional().allow(null, ""),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Format nomor telepon tidak valid",
    }),
  timezone: Joi.string().optional(),
  openTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
  closeTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Format waktu tidak valid (gunakan HH:MM atau HH:MM:SS)",
    }),
});

/**
 * Validation schema untuk add admin
 */
export const addAdminSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Format email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  role: Joi.string().valid("staff", "manager").required().messages({
    "any.only": "Role harus staff atau manager",
    "any.required": "Role wajib diisi",
  }),
});

/**
 * Validation schema untuk add device
 */
export const addDeviceSchema = Joi.object({
  code: Joi.string().max(32).required().messages({
    "string.max": "Kode device maksimal 32 karakter",
    "any.required": "Kode device wajib diisi",
  }),
  type: Joi.string()
    .valid("ps", "racing", "vr", "pc", "arcade")
    .required()
    .messages({
      "any.only": "Type harus salah satu dari: ps, racing, vr, pc, arcade",
      "any.required": "Type device wajib diisi",
    }),
  specs: Joi.object().optional().allow(null),
  status: Joi.string()
    .valid("active", "maintenance", "disabled")
    .optional()
    .messages({
      "any.only": "Status harus salah satu dari: active, maintenance, disabled",
    }),
});

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
