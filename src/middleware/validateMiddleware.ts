import { Request, Response, NextFunction } from "express";
import Joi from "joi";

/**
 * Middleware untuk validasi request body menggunakan Joi schema
 */
export const validateBody = (schema: Joi.ObjectSchema) => {
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

/**
 * Middleware untuk validasi request query menggunakan Joi schema
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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

/**
 * Middleware untuk validasi request params menggunakan Joi schema
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
