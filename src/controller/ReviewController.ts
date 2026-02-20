import { Request, Response } from "express";
import { handleError } from "../helper/responseHelper";
import {
  createReviewService,
  getReviewsService,
  getReviewByIdService,
  updateReviewService,
  deleteReviewService,
} from "../service/ReviewService/reviewService";
import {
  getBranchReviewStatsService,
  getCustomerReviewStatsService,
  getTopRatedReviewsService,
  getLowRatedReviewsService,
  getRecentReviewsService,
} from "../service/ReviewService/reviewAggregationService";

/**
 * Serialize review for response - BigInt to string conversion
 */
const serializeReview = (review: any) => {
  return JSON.parse(
    JSON.stringify(review, (_key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
};

/**
 * POST /reviews
 * Create review (customer only, for branch with at least one completed order)
 */
export const createReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const { branchId, rating, comment } = req.body;

    const review = await createReviewService({
      userId,
      branchId: BigInt(branchId),
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review berhasil dibuat",
      data: serializeReview(review),
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /reviews
 * Get reviews (public access)
 */
export const getReviews = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user ? BigInt(req.user.userId) : undefined;
    const role = req.user?.role;
    const { branchId, minRating, skip, take } = req.query;

    const { reviews, total } = await getReviewsService({
      userId,
      role,
      branchId: branchId ? BigInt(String(branchId)) : undefined,
      minRating: minRating ? parseInt(String(minRating)) : undefined,
      skip: skip ? parseInt(String(skip)) : 0,
      take: take ? parseInt(String(take)) : 10,
    });

    res.status(200).json({
      success: true,
      data: reviews.map(serializeReview),
      meta: {
        total,
        skip,
        take,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /reviews/:id
 * Get review by ID (role-based access control)
 */
export const getReviewById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const reviewId = BigInt(req.params.id);

    const review = await getReviewByIdService({
      userId,
      role,
      reviewId,
    });

    res.status(200).json({
      success: true,
      data: serializeReview(review),
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PUT /reviews/:id
 * Update review (customer only, own reviews)
 */
export const updateReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const reviewId = BigInt(req.params.id);
    const { rating, comment } = req.body;

    const review = await updateReviewService({
      userId,
      reviewId,
      rating,
      comment,
    });

    res.status(200).json({
      success: true,
      message: "Review berhasil diupdate",
      data: serializeReview(review),
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * DELETE /reviews/:id
 * Delete review (customer or admin/owner)
 */
export const deleteReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const reviewId = BigInt(req.params.id);

    await deleteReviewService({
      userId,
      role,
      reviewId,
    });

    res.status(200).json({
      success: true,
      message: "Review berhasil dihapus",
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /branches/:branchId/reviews/stats
 * Get review statistics for a branch (admin/owner only)
 */
export const getBranchReviewStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const branchId = BigInt(req.params.branchId);

    const stats = await getBranchReviewStatsService({
      userId,
      role,
      branchId,
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /reviews/stats/customer
 * Get review statistics for a customer
 */
export const getCustomerReviewStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const { customerId } = req.query;

    const stats = await getCustomerReviewStatsService({
      userId,
      role,
      customerId: customerId ? BigInt(String(customerId)) : undefined,
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /branches/:branchId/reviews/top-rated
 * Get top rated reviews for a branch (admin/owner only)
 */
export const getTopRatedReviews = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const branchId = BigInt(req.params.branchId);
    const { limit } = req.query;

    const reviews = await getTopRatedReviewsService({
      userId,
      role,
      branchId,
      limit: limit ? parseInt(String(limit)) : 5,
    });

    res.status(200).json({
      success: true,
      data: reviews.map(serializeReview),
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /branches/:branchId/reviews/low-rated
 * Get low rated reviews for a branch (admin/owner only)
 */
export const getLowRatedReviews = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const branchId = BigInt(req.params.branchId);
    const { limit } = req.query;

    const reviews = await getLowRatedReviewsService({
      userId,
      role,
      branchId,
      limit: limit ? parseInt(String(limit)) : 5,
    });

    res.status(200).json({
      success: true,
      data: reviews.map(serializeReview),
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /branches/:branchId/reviews/recent
 * Get recent reviews for a branch (admin/owner only)
 */
export const getRecentReviews = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const branchId = BigInt(req.params.branchId);
    const { limit } = req.query;

    const reviews = await getRecentReviewsService({
      userId,
      role,
      branchId,
      limit: limit ? parseInt(String(limit)) : 10,
    });

    res.status(200).json({
      success: true,
      data: reviews.map(serializeReview),
    });
  } catch (error) {
    handleError(error, res);
  }
};
