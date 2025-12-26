import { Request, Response, NextFunction } from "express";
import { JWTPayload } from "../helper/jwtHelper";
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
//# sourceMappingURL=authMiddleware.d.ts.map