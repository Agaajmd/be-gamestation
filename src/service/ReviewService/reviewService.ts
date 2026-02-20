import { prisma } from "../../database";
import { ReviewRepository } from "../../repository/reviewRepository";
import { sanitizeString, sanitizeNumber } from "../../helper/inputSanitizer";

// Error imports
import {
  InvalidRatingError,
  UnauthorizedReviewAccessError,
} from "../../errors/ReviewError/reviewError";
import { OrderNotCompletedError } from "../../errors/OrderError/orderError";

import { ReviewNotFoundError } from "../../errors/ReviewError/ReviewNotFoundError";
import { DuplicateReviewError } from "../../errors/ReviewError/DuplicateReviewError";

/**
 * Create review (customer only, for branch with at least one completed order)
 */
export const createReviewService = async (payload: {
  userId: bigint;
  branchId: bigint;
  rating: number;
  comment?: string;
}) => {
  const { userId, branchId, rating: rawRating, comment: rawComment } = payload;

  // Sanitize inputs
  const rating = sanitizeNumber(rawRating, 1, 5);
  const comment = rawComment ? sanitizeString(rawComment) : undefined;

  // Validate rating
  if (rating === null || !Number.isInteger(rating)) {
    throw new InvalidRatingError();
  }

  // Check if customer has at least one completed order for this branch
  const completedOrder = await prisma.order.findFirst({
    where: {
      customerId: userId,
      branchId: branchId,
      status: "completed",
    },
  });

  if (!completedOrder) {
    throw new OrderNotCompletedError();
  }

  // Check if review already exists for this customer-branch combination
  const existingReview = await ReviewRepository.findByCustomerAndBranch(
    userId,
    branchId,
  );

  if (existingReview) {
    throw new DuplicateReviewError();
  }

  // Create review
  const review = await ReviewRepository.create({
    branchId,
    customerId: userId,
    rating,
    comment: comment || null,
  });

  return review;
};

/**
 * Get reviews (role-based filtering, public access allowed)
 */
export const getReviewsService = async (payload: {
  userId?: bigint;
  role?: string;
  branchId?: bigint;
  minRating?: number;
  skip?: number;
  take?: number;
}) => {
  const { userId, role, branchId, minRating, skip = 0, take = 10 } = payload;

  const where: any = {};

  if (role === "customer") {
    // Customers see only their own reviews
    where.customerId = userId;
    if (branchId) {
      where.branchId = branchId;
    }
  } else if (role === "admin") {
    // Admin sees reviews for their branch
    const admin = await prisma.admin.findUnique({
      where: { userId },
    });

    if (!admin) {
      throw new Error("Admin profile tidak ditemukan");
    }

    where.branchId = admin.branchId;
  } else if (role === "owner") {
    // Owner sees reviews for their branches
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: { branches: true },
    });

    if (!owner) {
      throw new Error("Owner profile tidak ditemukan");
    }

    const branchIds = owner.branches.map((b) => b.id);
    if (branchId && branchIds.includes(branchId)) {
      where.branchId = branchId;
    } else if (branchId && !branchIds.includes(branchId)) {
      throw new Error("Anda tidak memiliki akses ke branch ini");
    } else {
      where.branchId = {
        in: branchIds,
      };
    }
  }

  if (minRating) {
    where.rating = {
      gte: minRating,
    };
  }

  const reviews = await ReviewRepository.findMany(where, skip, take);
  const total = await ReviewRepository.count(where);

  return { reviews, total };
};

/**
 * Get review by ID (role-based access control, public access allowed)
 */
export const getReviewByIdService = async (payload: {
  userId?: bigint;
  role?: string;
  reviewId: bigint;
  branchId?: bigint;
}) => {
  const { userId, role, reviewId } = payload;

  const review = await ReviewRepository.findById(reviewId);

  if (!review) {
    throw new ReviewNotFoundError();
  }

  // Check access rights only if user is authenticated
  if (!role) {
    // Public access - allow viewing all reviews
    return review;
  }

  if (role === "customer") {
    if (review.customerId !== userId) {
      throw new UnauthorizedReviewAccessError();
    }
  } else if (role === "admin") {
    const admin = await prisma.admin.findUnique({
      where: { userId },
    });

    const reviewBranchId = (review.branch as any)?.id;
    if (!admin || !reviewBranchId || admin.branchId !== reviewBranchId) {
      throw new UnauthorizedReviewAccessError();
    }
  } else if (role === "owner") {
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: { branches: true },
    });

    const branchIds = owner?.branches.map((b) => b.id) || [];
    const reviewBranchId = (review.branch as any)?.id;
    if (!reviewBranchId || !branchIds.includes(reviewBranchId)) {
      throw new UnauthorizedReviewAccessError();
    }
  }

  return review;
};

/**
 * Update review (customer only, own reviews)
 */
export const updateReviewService = async (payload: {
  userId: bigint;
  reviewId: bigint;
  rating?: number;
  comment?: string;
}) => {
  const { userId, reviewId, rating: rawRating, comment: rawComment } = payload;

  // Sanitize inputs
  const rating =
    rawRating !== undefined ? sanitizeNumber(rawRating, 1, 5) : undefined;
  const comment =
    rawComment !== undefined ? sanitizeString(rawComment) : undefined;

  // Validate rating if provided
  if (rating !== undefined && rating === null) {
    throw new InvalidRatingError();
  }

  const review = await ReviewRepository.findById(reviewId);

  if (!review) {
    throw new ReviewNotFoundError();
  }

  // Only customer who created the review can update it
  if (review.customerId !== userId) {
    throw new UnauthorizedReviewAccessError();
  }

  // Update review
  const updateData: any = {};
  if (rating !== undefined) {
    updateData.rating = rating;
  }
  if (comment !== undefined) {
    updateData.comment = comment;
  }

  const updatedReview = await ReviewRepository.update(reviewId, updateData);

  return updatedReview;
};

/**
 * Delete review (customer or admin/owner)
 */
export const deleteReviewService = async (payload: {
  userId: bigint;
  role: string;
  reviewId: bigint;
}) => {
  const { userId, role, reviewId } = payload;

  const review = await ReviewRepository.findById(reviewId);

  if (!review) {
    throw new ReviewNotFoundError();
  }

  // Check access rights
  if (role === "customer") {
    // Customer can only delete their own reviews
    if (review.customerId !== userId) {
      throw new UnauthorizedReviewAccessError();
    }
  } else if (role === "admin") {
    const admin = await prisma.admin.findUnique({
      where: { userId },
    });

    const reviewBranchId = (review.branch as any)?.id;
    if (!admin || !reviewBranchId || admin.branchId !== reviewBranchId) {
      throw new UnauthorizedReviewAccessError();
    }
  } else if (role === "owner") {
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: { branches: true },
    });

    const branchIds = owner?.branches.map((b) => b.id) || [];
    const reviewBranchId = (review.branch as any)?.id;
    if (!reviewBranchId || !branchIds.includes(reviewBranchId)) {
      throw new UnauthorizedReviewAccessError();
    }
  }

  await ReviewRepository.delete(reviewId);

  return { success: true };
};
