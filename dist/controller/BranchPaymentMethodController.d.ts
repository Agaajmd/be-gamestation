import { Request, Response } from "express";
/**
 * POST /branch-payment-methods
 * Menambahkan payment method untuk branch
 */
export declare const addBranchPaymentMethod: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branch-payment-methods/:branchId
 * Mendapatkan semua payment methods untuk branch
 */
export declare const getBranchPaymentMethods: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branch-payment-methods/:branchId/active
 * Mendapatkan payment methods yang aktif untuk branch
 */
export declare const getActiveBranchPaymentMethods: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branch-payment-methods/detail/:id
 * Mendapatkan detail payment method berdasarkan ID
 */
export declare const getBranchPaymentMethodById: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /branch-payment-methods/:id
 * Memperbarui payment method
 */
export declare const updateBranchPaymentMethod: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /branch-payment-methods/:id
 * Menghapus payment method
 */
export declare const deleteBranchPaymentMethod: (req: Request, res: Response) => Promise<void>;
/**
 * PATCH /branch-payment-methods/:id/toggle-status
 * Toggle payment method active status
 */
export declare const toggleBranchPaymentMethodStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=BranchPaymentMethodController.d.ts.map