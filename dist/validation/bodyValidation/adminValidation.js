"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminSchema = exports.addAdminSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema untuk add admin
 */
exports.addAdminSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Format email tidak valid",
        "any.required": "Email wajib diisi",
    }),
    role: joi_1.default.string().valid("staff", "manager").required().messages({
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
exports.updateAdminSchema = joi_1.default.object({
    role: joi_1.default.string().valid("staff", "manager").optional().messages({
        "any.only": "Role harus staff atau manager",
        "any.required": "Role wajib diisi",
    }),
    newBranchId: joi_1.default.string().optional().messages({
        "string.base": "newBranchId harus berupa string",
    }),
})
    .or("role", "newBranchId")
    .messages({
    "object.missing": "Minimal salah satu field (role atau newBranchId) harus diisi",
});
//# sourceMappingURL=adminValidation.js.map