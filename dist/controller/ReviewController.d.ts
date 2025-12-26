import { Request, Response } from "express";
/**
 * POST /reviews
 * Create review (customer only, for completed orders)
 */
export declare const createReview: (req: Request, res: Response) => Promise<void>;
/**
 * GET /reviews
 * Get reviews list
 * - Customer: see own reviews
 * - Admin: see reviews for their branch
 * - Owner: see all reviews in their branches
 */
export declare const getReviews: (req: Request, res: Response) => Promise<void>;
/**
 * GET /reviews/:id
 * Get review by ID
 */
export declare const getReviewById: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /reviews/:id
 * Update review (customer can only update their own review)
 */
export declare const updateReview: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /reviews/:id
 * Delete review (customer can only delete their own review)
 */
export declare const deleteReview: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=ReviewController.d.ts.map