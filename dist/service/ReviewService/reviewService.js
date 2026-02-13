"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewService = exports.updateReviewService = exports.getReviewByIdService = exports.getReviewsService = exports.createReviewService = void 0;
const database_1 = require("../../database");
const reviewRepository_1 = require("../../repository/reviewRepository");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Error imports
const reviewError_1 = require("../../errors/ReviewError/reviewError");
const orderError_1 = require("../../errors/OrderError/orderError");
const ReviewNotFoundError_1 = require("../../errors/ReviewError/ReviewNotFoundError");
const DuplicateReviewError_1 = require("../../errors/ReviewError/DuplicateReviewError");
/**
 * Create review (customer only, for branch with at least one completed order)
 */
const createReviewService = async (payload) => {
    const { userId, branchId, rating: rawRating, comment: rawComment } = payload;
    // Sanitize inputs
    const rating = (0, inputSanitizer_1.sanitizeNumber)(rawRating, 1, 5);
    const comment = rawComment ? (0, inputSanitizer_1.sanitizeString)(rawComment) : undefined;
    // Validate rating
    if (rating === null || !Number.isInteger(rating)) {
        throw new reviewError_1.InvalidRatingError();
    }
    // Check if customer has at least one completed order for this branch
    const completedOrder = await database_1.prisma.order.findFirst({
        where: {
            customerId: userId,
            branchId: branchId,
            status: "completed",
        },
    });
    if (!completedOrder) {
        throw new orderError_1.OrderNotCompletedError();
    }
    // Check if review already exists for this customer-branch combination
    const existingReview = await reviewRepository_1.ReviewRepository.findByCustomerAndBranch(userId, branchId);
    if (existingReview) {
        throw new DuplicateReviewError_1.DuplicateReviewError();
    }
    // Create review
    const review = await reviewRepository_1.ReviewRepository.create({
        branchId,
        customerId: userId,
        rating,
        comment: comment || null,
    });
    return review;
};
exports.createReviewService = createReviewService;
/**
 * Get reviews (role-based filtering)
 */
const getReviewsService = async (payload) => {
    const { userId, role, branchId, minRating, skip = 0, take = 10 } = payload;
    const where = {};
    if (role === "customer") {
        // Customers see only their own reviews
        where.customerId = userId;
        if (branchId) {
            where.branchId = branchId;
        }
    }
    else if (role === "admin") {
        // Admin sees reviews for their branch
        const admin = await database_1.prisma.admin.findUnique({
            where: { userId },
        });
        if (!admin) {
            throw new Error("Admin profile tidak ditemukan");
        }
        where.branchId = admin.branchId;
    }
    else if (role === "owner") {
        // Owner sees reviews for their branches
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        if (!owner) {
            throw new Error("Owner profile tidak ditemukan");
        }
        const branchIds = owner.branches.map((b) => b.id);
        if (branchId && branchIds.includes(branchId)) {
            where.branchId = branchId;
        }
        else if (branchId && !branchIds.includes(branchId)) {
            throw new Error("Anda tidak memiliki akses ke branch ini");
        }
        else {
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
    const reviews = await reviewRepository_1.ReviewRepository.findMany(where, skip, take);
    const total = await reviewRepository_1.ReviewRepository.count(where);
    return { reviews, total };
};
exports.getReviewsService = getReviewsService;
/**
 * Get review by ID (role-based access control)
 */
const getReviewByIdService = async (payload) => {
    const { userId, role, reviewId } = payload;
    const review = await reviewRepository_1.ReviewRepository.findById(reviewId);
    if (!review) {
        throw new ReviewNotFoundError_1.ReviewNotFoundError();
    }
    // Check access rights
    if (role === "customer") {
        if (review.customerId !== userId) {
            throw new reviewError_1.UnauthorizedReviewAccessError();
        }
    }
    else if (role === "admin") {
        const admin = await database_1.prisma.admin.findUnique({
            where: { userId },
        });
        const reviewBranchId = review.branch?.id;
        if (!admin || !reviewBranchId || admin.branchId !== reviewBranchId) {
            throw new reviewError_1.UnauthorizedReviewAccessError();
        }
    }
    else if (role === "owner") {
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        const branchIds = owner?.branches.map((b) => b.id) || [];
        const reviewBranchId = review.branch?.id;
        if (!reviewBranchId || !branchIds.includes(reviewBranchId)) {
            throw new reviewError_1.UnauthorizedReviewAccessError();
        }
    }
    return review;
};
exports.getReviewByIdService = getReviewByIdService;
/**
 * Update review (customer only, own reviews)
 */
const updateReviewService = async (payload) => {
    const { userId, reviewId, rating: rawRating, comment: rawComment } = payload;
    // Sanitize inputs
    const rating = rawRating !== undefined ? (0, inputSanitizer_1.sanitizeNumber)(rawRating, 1, 5) : undefined;
    const comment = rawComment !== undefined ? (0, inputSanitizer_1.sanitizeString)(rawComment) : undefined;
    // Validate rating if provided
    if (rating !== undefined && rating === null) {
        throw new reviewError_1.InvalidRatingError();
    }
    const review = await reviewRepository_1.ReviewRepository.findById(reviewId);
    if (!review) {
        throw new ReviewNotFoundError_1.ReviewNotFoundError();
    }
    // Only customer who created the review can update it
    if (review.customerId !== userId) {
        throw new reviewError_1.UnauthorizedReviewAccessError();
    }
    // Update review
    const updateData = {};
    if (rating !== undefined) {
        updateData.rating = rating;
    }
    if (comment !== undefined) {
        updateData.comment = comment;
    }
    const updatedReview = await reviewRepository_1.ReviewRepository.update(reviewId, updateData);
    return updatedReview;
};
exports.updateReviewService = updateReviewService;
/**
 * Delete review (customer or admin/owner)
 */
const deleteReviewService = async (payload) => {
    const { userId, role, reviewId } = payload;
    const review = await reviewRepository_1.ReviewRepository.findById(reviewId);
    if (!review) {
        throw new ReviewNotFoundError_1.ReviewNotFoundError();
    }
    // Check access rights
    if (role === "customer") {
        // Customer can only delete their own reviews
        if (review.customerId !== userId) {
            throw new reviewError_1.UnauthorizedReviewAccessError();
        }
    }
    else if (role === "admin") {
        const admin = await database_1.prisma.admin.findUnique({
            where: { userId },
        });
        const reviewBranchId = review.branch?.id;
        if (!admin || !reviewBranchId || admin.branchId !== reviewBranchId) {
            throw new reviewError_1.UnauthorizedReviewAccessError();
        }
    }
    else if (role === "owner") {
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        const branchIds = owner?.branches.map((b) => b.id) || [];
        const reviewBranchId = review.branch?.id;
        if (!reviewBranchId || !branchIds.includes(reviewBranchId)) {
            throw new reviewError_1.UnauthorizedReviewAccessError();
        }
    }
    await reviewRepository_1.ReviewRepository.delete(reviewId);
    return { success: true };
};
exports.deleteReviewService = deleteReviewService;
//# sourceMappingURL=reviewService.js.map