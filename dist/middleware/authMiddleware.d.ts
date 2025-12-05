import { Request, Response, NextFunction } from "express";
interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
/**
 * Middleware untuk verifikasi JWT token
 */
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware untuk cek role user
 */
export declare const authorizeRoles: (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=authMiddleware.d.ts.map