import Joi from "joi";

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
})
  .or("email", "role")
  .messages({
    "object.missing": "Minimal salah satu field (email atau role) harus diisi",
  });

/**
 * Validation schema untuk update admin
 */
export const updateAdminSchema = Joi.object({
  role: Joi.string().valid("staff", "manager").optional().messages({
    "any.only": "Role harus staff atau manager",
    "any.required": "Role wajib diisi",
  }),
  newBranchId: Joi.string().optional().messages({
    "string.base": "newBranchId harus berupa string",
  }),
})
  .or("role", "newBranchId")
  .messages({
    "object.missing":
      "Minimal salah satu field (role atau newBranchId) harus diisi",
  });
