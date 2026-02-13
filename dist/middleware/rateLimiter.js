"use strict";
/**
 * Rate Limiting Middleware
 * Protects API endpoints from brute force and DDoS attacks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRateLimiter = exports.emailVerificationLimiter = exports.passwordResetLimiter = exports.apiRateLimiter = exports.authRateLimiter = exports.createRateLimiter = void 0;
const rateLimitStore = {};
/**
 * Generic rate limiter middleware factory
 * @param windowMs - Time window in milliseconds
 * @param maxRequests - Maximum requests per window
 * @param message - Error message
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, // 15 minutes
maxRequests = 100, message = "Too many requests, please try again later") => {
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress || "unknown";
        // Clean up old entries
        const now = Date.now();
        Object.keys(rateLimitStore).forEach((key) => {
            if (rateLimitStore[key].resetTime < now) {
                delete rateLimitStore[key];
            }
        });
        if (!rateLimitStore[ip]) {
            rateLimitStore[ip] = {
                attempts: 1,
                resetTime: Date.now() + windowMs,
            };
            return next();
        }
        const record = rateLimitStore[ip];
        if (Date.now() > record.resetTime) {
            record.attempts = 1;
            record.resetTime = Date.now() + windowMs;
            return next();
        }
        record.attempts++;
        if (record.attempts > maxRequests) {
            res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil((record.resetTime - Date.now()) / 1000),
            });
            return;
        }
        // Add rate limit headers
        res.set("X-RateLimit-Limit", maxRequests.toString());
        res.set("X-RateLimit-Remaining", (maxRequests - record.attempts).toString());
        res.set("X-RateLimit-Reset", record.resetTime.toString());
        next();
    };
};
exports.createRateLimiter = createRateLimiter;
/**
 * Strict rate limiter for authentication endpoints
 * 5 attempts per 15 minutes per IP
 */
exports.authRateLimiter = (0, exports.createRateLimiter)(15 * 60 * 1000, // 15 minutes
5, // 5 attempts
"Too many login attempts. Please try again after 15 minutes");
/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
exports.apiRateLimiter = (0, exports.createRateLimiter)(15 * 60 * 1000, // 15 minutes
100, // 100 requests
"Too many requests. Please try again later");
/**
 * Strict rate limiter for password reset
 * 3 attempts per hour per IP
 */
exports.passwordResetLimiter = (0, exports.createRateLimiter)(60 * 60 * 1000, // 60 minutes
3, // 3 attempts
"Too many password reset attempts. Please try again after 1 hour");
/**
 * Email verification limiter
 * 5 attempts per 10 minutes per IP
 */
exports.emailVerificationLimiter = (0, exports.createRateLimiter)(10 * 60 * 1000, // 10 minutes
5, // 5 attempts
"Too many verification requests. Please try again later");
/**
 * File upload limiter
 * 50 uploads per hour per IP
 */
exports.uploadRateLimiter = (0, exports.createRateLimiter)(60 * 60 * 1000, // 60 minutes
50, // 50 uploads
"Too many upload requests. Please try again later");
//# sourceMappingURL=rateLimiter.js.map