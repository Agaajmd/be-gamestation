/**
 * Input Sanitization Helper
 * Protects against XSS, SQL injection, and other input-based attacks
 */

/**
 * Sanitize string input to prevent XSS attacks
 * Removes/escapes potentially dangerous characters
 */
export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    .trim()
    .replace(/[<>]/g, (match) => {
      const escapeMap: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
      };
      return escapeMap[match];
    })
    .slice(0, 1000); // Limit length to prevent DoS
};

/**
 * Sanitize email input
 */
export const sanitizeEmail = (email: string): string => {
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

/**
 * Sanitize file upload - check file extension and MIME type
 */
export const sanitizeFileUpload = (
  filename: string,
  mimetype: string,
  allowedMimetypes: string[] = ["image/jpeg", "image/png", "image/webp"]
): { isValid: boolean; sanitizedFilename?: string; error?: string } => {
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

/**
 * Sanitize number input
 */
export const sanitizeNumber = (input: any, min?: number, max?: number): number | null => {
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

/**
 * Sanitize object - recursively sanitize all string values
 */
export const sanitizeObject = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (typeof obj === "object") {
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Sanitize query parameters
 */
export const sanitizeQueryParams = (query: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(query)) {
    // Limit key length
    if (key.length > 50) {
      continue;
    }

    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === "number") {
      sanitized[key] = value;
    } else if (typeof value === "boolean") {
      sanitized[key] = value;
    } else if (Array.isArray(value)) {
      sanitized[key] = value
        .filter((v) => typeof v === "string" || typeof v === "number")
        .map((v) => (typeof v === "string" ? sanitizeString(v) : v));
    }
  }

  return sanitized;
};
