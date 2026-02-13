/**
 * Security Headers Middleware using Helmet
 * Sets various HTTP headers to protect against common attacks
 */

import { Request, Response, NextFunction } from "express";

/**
 * Custom security headers middleware
 * Implements OWASP security best practices
 */
export const securityHeadersMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
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
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );

  // Content Security Policy - prevent inline scripts and restrict sources
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );

  // Strict Transport Security - force HTTPS in production
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  next();
};

/**
 * Disable powered by header to hide server info
 */
export const hidePoweredByMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.removeHeader("X-Powered-By");
  res.setHeader("Server", "GameStation/1.0");
  next();
};

/**
 * CORS security middleware - configure allowed origins
 */
export const getCorsOptions = () => {
  const allowedOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(",").map(o => o.trim()) 
    : ["http://localhost:3001", "http://localhost:3000"];

  return {
    origin: (origin: string | undefined, callback: any) => {
      // Allow if no origin (like mobile/Postman) or if it's in our list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS Blocked for origin: ${origin}`); // Helpful for debugging Railway logs
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
