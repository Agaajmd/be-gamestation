import { Request, Response, NextFunction } from "express";
import Joi from "joi";
/**
 * Middleware untuk validasi request body menggunakan Joi schema
 */
export declare const validateBody: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware untuk validasi request query menggunakan Joi schema
 */
export declare const validateQuery: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware untuk validasi request params menggunakan Joi schema
 */
export declare const validateParams: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validateMiddleware.d.ts.map