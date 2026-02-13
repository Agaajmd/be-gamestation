/**
 * Input Sanitization Helper
 * Protects against XSS, SQL injection, and other input-based attacks
 */
/**
 * Sanitize string input to prevent XSS attacks
 * Removes/escapes potentially dangerous characters
 */
export declare const sanitizeString: (input: string) => string;
/**
 * Sanitize email input
 */
export declare const sanitizeEmail: (email: string) => string;
/**
 * Sanitize file upload - check file extension and MIME type
 */
export declare const sanitizeFileUpload: (filename: string, mimetype: string, allowedMimetypes?: string[]) => {
    isValid: boolean;
    sanitizedFilename?: string;
    error?: string;
};
/**
 * Sanitize number input
 */
export declare const sanitizeNumber: (input: any, min?: number, max?: number) => number | null;
/**
 * Sanitize object - recursively sanitize all string values
 */
export declare const sanitizeObject: (obj: any) => any;
/**
 * Sanitize query parameters
 */
export declare const sanitizeQueryParams: (query: Record<string, any>) => Record<string, any>;
//# sourceMappingURL=inputSanitizer.d.ts.map