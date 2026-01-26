import { Request, Response, NextFunction } from "express";
/**
 * Middleware untuk memastikan user adalah Owner
 * Mengharapkan req.user sudah di-set oleh authenticateToken middleware
 */
export declare const requireOwner: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware untuk memastikan user adalah Admin
 * Mengharapkan req.user sudah di-set oleh authenticateToken middleware
 */
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware untuk memastikan user adalah Owner atau Admin
 */
export declare const requireOwnerOrAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireOwnerOrAdminStaff: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware untuk memastikan user adalah Customer
 * Mengharapkan req.user sudah di-set oleh authenticateToken middleware
 */
export declare const requireCustomer: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=roleMiddleware.d.ts.map