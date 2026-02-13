/**
 * Security Headers Middleware using Helmet
 * Sets various HTTP headers to protect against common attacks
 */
import { Request, Response, NextFunction } from "express";
/**
 * Custom security headers middleware
 * Implements OWASP security best practices
 */
export declare const securityHeadersMiddleware: (_req: Request, res: Response, next: NextFunction) => void;
/**
 * Disable powered by header to hide server info
 */
export declare const hidePoweredByMiddleware: (_req: Request, res: Response, next: NextFunction) => void;
/**
 * CORS security middleware - configure allowed origins
 */
export declare const getCorsOptions: () => {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    optionsSuccessStatus: number;
    maxAge: number;
};
//# sourceMappingURL=securityHeaders.d.ts.map