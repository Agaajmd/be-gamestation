"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentReviews = exports.getLowRatedReviews = exports.getTopRatedReviews = exports.getCustomerReviewStats = exports.getBranchReviewStats = exports.deleteReview = exports.updateReview = exports.getReviewById = exports.getReviews = exports.createReview = void 0;
const responseHelper_1 = require("../helper/responseHelper");
const reviewService_1 = require("../service/ReviewService/reviewService");
const reviewAggregationService_1 = require("../service/ReviewService/reviewAggregationService");
/**
 * Serialize review for response - BigInt to string conversion
 */
const serializeReview = (review) => {
    return JSON.parse(JSON.stringify(review, (_key, value) => typeof value === "bigint" ? value.toString() : value));
};
/**
 * POST /reviews
 * Create review (customer only, for branch with at least one completed order)
 */
const createReview = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const { branchId, rating, comment } = req.body;
        const review = await (0, reviewService_1.createReviewService)({
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
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.createReview = createReview;
/**
 * GET /reviews
 * Get reviews (role-based filtering)
 */
const getReviews = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const { branchId, minRating, skip, take } = req.query;
        const { reviews, total } = await (0, reviewService_1.getReviewsService)({
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
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getReviews = getReviews;
/**
 * GET /reviews/:id
 * Get review by ID (role-based access control)
 */
const getReviewById = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const reviewId = BigInt(req.params.id);
        const review = await (0, reviewService_1.getReviewByIdService)({
            userId,
            role,
            reviewId,
        });
        res.status(200).json({
            success: true,
            data: serializeReview(review),
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getReviewById = getReviewById;
/**
 * PUT /reviews/:id
 * Update review (customer only, own reviews)
 */
const updateReview = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const reviewId = BigInt(req.params.id);
        const { rating, comment } = req.body;
        const review = await (0, reviewService_1.updateReviewService)({
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
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateReview = updateReview;
/**
 * DELETE /reviews/:id
 * Delete review (customer or admin/owner)
 */
const deleteReview = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const reviewId = BigInt(req.params.id);
        await (0, reviewService_1.deleteReviewService)({
            userId,
            role,
            reviewId,
        });
        res.status(200).json({
            success: true,
            message: "Review berhasil dihapus",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.deleteReview = deleteReview;
/**
 * GET /branches/:branchId/reviews/stats
 * Get review statistics for a branch (admin/owner only)
 */
const getBranchReviewStats = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const branchId = BigInt(req.params.branchId);
        const stats = await (0, reviewAggregationService_1.getBranchReviewStatsService)({
            userId,
            role,
            branchId,
        });
        res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getBranchReviewStats = getBranchReviewStats;
/**
 * GET /reviews/stats/customer
 * Get review statistics for a customer
 */
const getCustomerReviewStats = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const { customerId } = req.query;
        const stats = await (0, reviewAggregationService_1.getCustomerReviewStatsService)({
            userId,
            role,
            customerId: customerId ? BigInt(String(customerId)) : undefined,
        });
        res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getCustomerReviewStats = getCustomerReviewStats;
/**
 * GET /branches/:branchId/reviews/top-rated
 * Get top rated reviews for a branch (admin/owner only)
 */
const getTopRatedReviews = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const branchId = BigInt(req.params.branchId);
        const { limit } = req.query;
        const reviews = await (0, reviewAggregationService_1.getTopRatedReviewsService)({
            userId,
            role,
            branchId,
            limit: limit ? parseInt(String(limit)) : 5,
        });
        res.status(200).json({
            success: true,
            data: reviews.map(serializeReview),
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getTopRatedReviews = getTopRatedReviews;
/**
 * GET /branches/:branchId/reviews/low-rated
 * Get low rated reviews for a branch (admin/owner only)
 */
const getLowRatedReviews = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const branchId = BigInt(req.params.branchId);
        const { limit } = req.query;
        const reviews = await (0, reviewAggregationService_1.getLowRatedReviewsService)({
            userId,
            role,
            branchId,
            limit: limit ? parseInt(String(limit)) : 5,
        });
        res.status(200).json({
            success: true,
            data: reviews.map(serializeReview),
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getLowRatedReviews = getLowRatedReviews;
/**
 * GET /branches/:branchId/reviews/recent
 * Get recent reviews for a branch (admin/owner only)
 */
const getRecentReviews = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const branchId = BigInt(req.params.branchId);
        const { limit } = req.query;
        const reviews = await (0, reviewAggregationService_1.getRecentReviewsService)({
            userId,
            role,
            branchId,
            limit: limit ? parseInt(String(limit)) : 10,
        });
        res.status(200).json({
            success: true,
            data: reviews.map(serializeReview),
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getRecentReviews = getRecentReviews;
//# sourceMappingURL=ReviewController.js.map