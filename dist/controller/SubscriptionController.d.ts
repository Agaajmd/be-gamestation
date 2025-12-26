import { Request, Response } from "express";
/**
 * POST /subscriptions
 * Create subscription (owner only)
 */
export declare const createSubscription: (req: Request, res: Response) => Promise<void>;
/**
 * GET /subscriptions
 * Get subscriptions
 * - Owner: see own subscriptions
 * - Admin: not allowed (403)
 */
export declare const getSubscriptions: (req: Request, res: Response) => Promise<void>;
/**
 * GET /subscriptions/:id
 * Get subscription by ID
 */
export declare const getSubscriptionById: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /subscriptions/:id
 * Update subscription (owner only)
 */
export declare const updateSubscription: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /subscriptions/:id
 * Delete subscription (owner only)
 */
export declare const deleteSubscription: (req: Request, res: Response) => Promise<void>;
/**
 * GET /subscriptions/active
 * Get active subscription for owner
 */
export declare const getActiveSubscription: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=SubscriptionController.d.ts.map