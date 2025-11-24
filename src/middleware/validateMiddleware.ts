import { Request, Response, NextFunction } from "express";
import Joi from "joi";

/**
 * Middleware untuk validasi request body menggunakan Joi schema
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
