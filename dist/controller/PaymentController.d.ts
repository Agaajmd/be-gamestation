import { Request, Response } from "express";
/**
 * POST /payments
 * Create payment record (customer/admin/owner)
 */
export declare const createPayment: (req: Request, res: Response) => Promise<void>;
/**
 * GET /payments
 * Get payments (role-based filtering - admin/owner only)
 */
export declare const getPayments: (req: Request, res: Response) => Promise<void>;
/**
 * GET /payments/:id
 * Get payment by ID (role-based access control)
 */
export declare const getPaymentById: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /payments/:id
 * Update payment status (admin/owner only)
 */
export declare const updatePayment: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /payments/:id
 * Delete payment (admin/owner only)
 */
export declare const deletePayment: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=PaymentController.d.ts.map