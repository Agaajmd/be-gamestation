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
 * Update subscription
 */
export declare const updateSubscription: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /subscriptions/:id/cancel
 * Cancel subscription
 */
export declare const cancelSubscription: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=SubscriptionController.d.ts.map