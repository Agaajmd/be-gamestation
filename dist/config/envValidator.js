"use strict";
/**
 * Environment Variables Validator
 * Validates all required environment variables on startup
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = exports.validateEnvironment = void 0;
/**
 * Validate environment variables
 * Throws error if required variables are missing or invalid
 */
const validateEnvironment = () => {
    const errors = [];
    // Check required variables
    const requiredVars = [
        "DATABASE_URL",
        "JWT_SECRET",
        "JWT_REFRESH_SECRET",
        "SMTP_USER",
        "SMTP_PASS",
        "SMTP_HOST",
    ];
    requiredVars.forEach((varName) => {
        if (!process.env[varName]) {
            errors.push(`${varName} is required but not defined`);
        }
    });
    // Validate JWT secrets length
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        errors.push("JWT_SECRET must be at least 32 characters long");
    }
    if (process.env.JWT_REFRESH_SECRET &&
        process.env.JWT_REFRESH_SECRET.length < 32) {
        errors.push("JWT_REFRESH_SECRET must be at least 32 characters long");
    }
    // Validate JWT secrets are different
    if (process.env.JWT_SECRET &&
        process.env.JWT_REFRESH_SECRET &&
        process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET) {
        errors.push("JWT_SECRET and JWT_REFRESH_SECRET must be different");
    }
    // Validate DATABASE_URL format
    if (process.env.DATABASE_URL &&
        !process.env.DATABASE_URL.startsWith("postgresql://")) {
        errors.push("DATABASE_URL must be a valid PostgreSQL connection string");
    }
    // Validate PORT is a number
    const port = parseInt(process.env.PORT || "3000", 10);
    if (isNaN(port) || port < 1 || port > 65535) {
        errors.push("PORT must be a valid port number (1-65535)");
    }
    // Validate NODE_ENV
    const validEnvs = ["development", "production", "test"];
    if (process.env.NODE_ENV && !validEnvs.includes(process.env.NODE_ENV)) {
        errors.push(`NODE_ENV must be one of: ${validEnvs.join(", ")}`);
    }
    // If there are errors, throw them all at once
    if (errors.length > 0) {
        console.error("❌ Environment Validation Errors:");
        errors.forEach((error) => console.error(`  - ${error}`));
        process.exit(1);
    }
    console.log("✅ Environment variables validated successfully");
    return {
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        PORT: port,
        NODE_ENV: (process.env.NODE_ENV || "development"),
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        SMTP_HOST: process.env.SMTP_HOST,
        API_KEY_SALT: process.env.API_KEY_SALT || "game-station-api-key",
    };
};
exports.validateEnvironment = validateEnvironment;
// Export validated config
exports.envConfig = (0, exports.validateEnvironment)();
//# sourceMappingURL=envValidator.js.map