"use strict";
/**
 * Security Headers Middleware using Helmet
 * Sets various HTTP headers to protect against common attacks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsOptions = exports.hidePoweredByMiddleware = exports.securityHeadersMiddleware = void 0;
/**
 * Custom security headers middleware
 * Implements OWASP security best practices
 */
const securityHeadersMiddleware = (_req, res, next) => {
    // Prevent MIME type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");
    // Enable XSS protection in older browsers
    res.setHeader("X-XSS-Protection", "1; mode=block");
    // Prevent clickjacking
    res.setHeader("X-Frame-Options", "DENY");
    // Disable HTTP TRACE method
    res.setHeader("X-HTTP-Method-Override", "false");
    // Referrer Policy - control how much referrer info is shared
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    // Permissions Policy (formerly Feature Policy)
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
    // Content Security Policy - prevent inline scripts and restrict sources
    res.setHeader("Content-Security-Policy", [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join("; "));
    // Strict Transport Security - force HTTPS in production
    if (process.env.NODE_ENV === "production") {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    }
    next();
};
exports.securityHeadersMiddleware = securityHeadersMiddleware;
/**
 * Disable powered by header to hide server info
 */
const hidePoweredByMiddleware = (_req, res, next) => {
    res.removeHeader("X-Powered-By");
    res.setHeader("Server", "GameStation/1.0");
    next();
};
exports.hidePoweredByMiddleware = hidePoweredByMiddleware;
/**
 * CORS security middleware - configure allowed origins
 */
const getCorsOptions = () => {
    const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [
        "http://localhost:3001",
        "http://localhost:3000",
    ];
    return {
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, curl requests, etc)
            if (!origin) {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 200,
        maxAge: 600, // 10 minutes
    };
};
exports.getCorsOptions = getCorsOptions;
//# sourceMappingURL=securityHeaders.js.map