import { Request, Response } from "express";
/**
 * POST /reviews
 * Create review (customer only, for branch with at least one completed order)
 */
export declare const createReview: (req: Request, res: Response) => Promise<void>;
/**
 * GET /reviews
 * Get reviews (role-based filtering)
 */
export declare const getReviews: (req: Request, res: Response) => Promise<void>;
/**
 * GET /reviews/:id
 * Get review by ID (role-based access control)
 */
export declare const getReviewById: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /reviews/:id
 * Update review (customer only, own reviews)
 */
export declare const updateReview: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /reviews/:id
 * Delete review (customer or admin/owner)
 */
export declare const deleteReview: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:branchId/reviews/stats
 * Get review statistics for a branch (admin/owner only)
 */
export declare const getBranchReviewStats: (req: Request, res: Response) => Promise<void>;
/**
 * GET /reviews/stats/customer
 * Get review statistics for a customer
 */
export declare const getCustomerReviewStats: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:branchId/reviews/top-rated
 * Get top rated reviews for a branch (admin/owner only)
 */
export declare const getTopRatedReviews: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:branchId/reviews/low-rated
 * Get low rated reviews for a branch (admin/owner only)
 */
export declare const getLowRatedReviews: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:branchId/reviews/recent
 * Get recent reviews for a branch (admin/owner only)
 */
export declare const getRecentReviews: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=ReviewController.d.ts.map