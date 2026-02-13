/**
 * Rate Limiting Middleware
 * Protects API endpoints from brute force and DDoS attacks
 */
import { Request, Response, NextFunction } from "express";
/**
 * Generic rate limiter middleware factory
 * @param windowMs - Time window in milliseconds
 * @param maxRequests - Maximum requests per window
 * @param message - Error message
 */
export declare const createRateLimiter: (windowMs?: number, // 15 minutes
maxRequests?: number, message?: string) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Strict rate limiter for authentication endpoints
 * 5 attempts per 15 minutes per IP
 */
export declare const authRateLimiter: (req: Request, res: Response, next: NextFunction) => void;
/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export declare const apiRateLimiter: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Strict rate limiter for password reset
 * 3 attempts per hour per IP
 */
export declare const passwordResetLimiter: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Email verification limiter
 * 5 attempts per 10 minutes per IP
 */
export declare const emailVerificationLimiter: (req: Request, res: Response, next: NextFunction) => void;
/**
 * File upload limiter
 * 50 uploads per hour per IP
 */
export declare const uploadRateLimiter: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rateLimiter.d.ts.map