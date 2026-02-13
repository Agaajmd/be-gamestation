import { Request, Response } from "express";
/**
 * POST /orders
 * Add to cart - Create new order with cart status (customer only)
 */
export declare const addToCart: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /orders/:id/checkout
 * Checkout order - Convert cart to pending (customer only)
 */
export declare const checkoutOrder: (req: Request, res: Response) => Promise<void>;
/**
 * GET /orders
 * Get orders - Role-based filtering
 */
export declare const getOrders: (req: Request, res: Response) => Promise<void>;
/**
 * GET /orders/:id
 * Get order by ID - Role-based access control
 */
export declare const getOrderById: (req: Request, res: Response) => Promise<void>;
/**
 * PATCH /orders/:id/status
 * Update order status - Admin/owner only with proper status transitions
 */
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /orders/:id
 * Cancel order - Admin/owner only, only if payment is invalid
 */
export declare const cancelOrder: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /orders-items/:id
 * Remove item from cart - Customer only
 */
export declare const removeItemFromCart: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=OrderController.d.ts.map