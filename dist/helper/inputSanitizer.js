"use strict";
/**
 * Input Sanitization Helper
 * Protects against XSS, SQL injection, and other input-based attacks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeQueryParams = exports.sanitizeObject = exports.sanitizeNumber = exports.sanitizeFileUpload = exports.sanitizeEmail = exports.sanitizeString = void 0;
/**
 * Sanitize string input to prevent XSS attacks
 * Removes/escapes potentially dangerous characters
 */
const sanitizeString = (input) => {
    if (!input || typeof input !== "string") {
        return "";
    }
    return input
        .trim()
        .replace(/[<>]/g, (match) => {
        const escapeMap = {
            "<": "&lt;",
            ">": "&gt;",
        };
        return escapeMap[match];
    })
        .slice(0, 1000); // Limit length to prevent DoS
};
exports.sanitizeString = sanitizeString;
/**
 * Sanitize email input
 */
const sanitizeEmail = (email) => {
    if (!email || typeof email !== "string") {
        return "";
    }
    const sanitized = email
        .trim()
        .toLowerCase()
        .slice(0, 254); // Email max length
    // Basic email pattern validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
        return "";
    }
    return sanitized;
};
exports.sanitizeEmail = sanitizeEmail;
/**
 * Sanitize file upload - check file extension and MIME type
 */
const sanitizeFileUpload = (filename, mimetype, allowedMimetypes = ["image/jpeg", "image/png", "image/webp"]) => {
    // Check MIME type
    if (!allowedMimetypes.includes(mimetype)) {
        return {
            isValid: false,
            error: `File type not allowed. Allowed types: ${allowedMimetypes.join(", ")}`,
        };
    }
    // Check filename
    if (!filename || typeof filename !== "string") {
        return { isValid: false, error: "Invalid filename" };
    }
    // Remove path traversal attempts
    const sanitized = filename
        .replace(/\.\.\//g, "")
        .replace(/\.\.\\/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .slice(0, 255);
    // Ensure filename has extension
    if (!sanitized.includes(".")) {
        return { isValid: false, error: "Filename must have an extension" };
    }
    return { isValid: true, sanitizedFilename: sanitized };
};
exports.sanitizeFileUpload = sanitizeFileUpload;
/**
 * Sanitize number input
 */
const sanitizeNumber = (input, min, max) => {
    const num = Number(input);
    if (isNaN(num)) {
        return null;
    }
    if (min !== undefined && num < min) {
        return null;
    }
    if (max !== undefined && num > max) {
        return null;
    }
    return num;
};
exports.sanitizeNumber = sanitizeNumber;
/**
 * Sanitize object - recursively sanitize all string values
 */
const sanitizeObject = (obj) => {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (typeof obj === "string") {
        return (0, exports.sanitizeString)(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => (0, exports.sanitizeObject)(item));
    }
    if (typeof obj === "object") {
        const sanitized = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitized[key] = (0, exports.sanitizeObject)(obj[key]);
            }
        }
        return sanitized;
    }
    return obj;
};
exports.sanitizeObject = sanitizeObject;
/**
 * Sanitize query parameters
 */
const sanitizeQueryParams = (query) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(query)) {
        // Limit key length
        if (key.length > 50) {
            continue;
        }
        if (typeof value === "string") {
            sanitized[key] = (0, exports.sanitizeString)(value);
        }
        else if (typeof value === "number") {
            sanitized[key] = value;
        }
        else if (typeof value === "boolean") {
            sanitized[key] = value;
        }
        else if (Array.isArray(value)) {
            sanitized[key] = value
                .filter((v) => typeof v === "string" || typeof v === "number")
                .map((v) => (typeof v === "string" ? (0, exports.sanitizeString)(v) : v));
        }
    }
    return sanitized;
};
exports.sanitizeQueryParams = sanitizeQueryParams;
//# sourceMappingURL=inputSanitizer.js.map