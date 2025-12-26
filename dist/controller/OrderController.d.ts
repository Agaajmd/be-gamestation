import { Request, Response } from "express";
/**
 * POST /orders
 * Create new order (customer only)
 */
export declare const createOrder: (req: Request, res: Response) => Promise<void>;
/**
 * GET /orders
 * Get orders list
 * - Customer: see own orders
 * - Admin: see orders in their branch
 * - Owner: see all orders in their branches
 */
export declare const getOrders: (req: Request, res: Response) => Promise<void>;
/**
 * GET /orders/:id
 * Get order by ID
 */
export declare const getOrderById: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /orders/:id/status
 * Update order status (admin/owner only)
 */
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /orders/:id/payment-status
 * Update payment status (admin/owner only)
 */
export declare const updatePaymentStatus: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /orders/:id
 * Cancel order (customer can cancel their own pending orders)
 */
export declare const cancelOrder: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=OrderController.d.ts.map