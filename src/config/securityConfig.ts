/**
 * Security Configuration
 * Centralizes all security settings
 */

export const securityConfig = {
  // Password requirements
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialCharsRegex: /[!@#$%^&*()_+\-=[\]{};:'",.<>?/\\|`~]/,
  },

  // JWT configuration
  jwt: {
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    algorithm: "HS256" as const,
    issuer: "game-station",
    audience: "users",
  },

  // Rate limiting
  rateLimiting: {
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: process.env.NODE_ENV === "production" ? 5 : 1000,
    },
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: process.env.NODE_ENV === "production" ? 100 : 10000,
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: process.env.NODE_ENV === "production" ? 3 : 1000,
    },
    emailVerification: {
      windowMs: 10 * 60 * 1000, // 10 minutes
      maxRequests: process.env.NODE_ENV === "production" ? 5 : 1000,
    },
    upload: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: process.env.NODE_ENV === "production" ? 50 : 10000,
    },
  },

  // File upload
  fileUpload: {
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    allowedMimetypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
  },

  // CORS
  cors: {
    maxAge: 600, // 10 minutes
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  },

  // Session
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict" as const,
  },

  // Security headers
  headers: {
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
  },

  // Input validation
  input: {
    maxStringLength: 1000,
    maxArrayLength: 1000,
    maxObjectDepth: 5,
  },

  // Security features
  features: {
    enableHelmet: true,
    enableRateLimiting: process.env.NODE_ENV === "production",
    enableInputSanitization: true,
    enableSecurityHeaders: true,
    enableApiKeyAuth: true,
    enableCsrfProtection: false, // Enable if using forms
  },
};
