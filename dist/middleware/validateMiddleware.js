"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
/**
 * Middleware untuk validasi request body menggunakan Joi schema
 */
const validateBody = (schema) => {
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
exports.validateBody = validateBody;
/**
 * Middleware untuk validasi request query menggunakan Joi schema
 */
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true,
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
        // Update req.query properties with validated values
        Object.assign(req.query, value);
        next();
    };
};
exports.validateQuery = validateQuery;
/**
 * Middleware untuk validasi request params menggunakan Joi schema
 */
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true,
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
        // Replace req.params with validated value
        req.params = value;
        next();
    };
};
exports.validateParams = validateParams;
//# sourceMappingURL=validateMiddleware.js.map