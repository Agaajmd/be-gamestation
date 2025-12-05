"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
/**
 * Middleware untuk validasi request body menggunakan Joi schema
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true, // Remove unknown keys from the validated data
        });
        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            }));
            res.status(400).json({
                success: false,
                message: "Validasi gagal",
                errors,
            });
            return;
        }
        // Replace req.body with validated value
        req.body = value;
        next();
    };
};
exports.validate = validate;
//# sourceMappingURL=validateMiddleware.js.map