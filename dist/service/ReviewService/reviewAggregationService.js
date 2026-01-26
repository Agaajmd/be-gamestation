"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentReviewsService = exports.getLowRatedReviewsService = exports.getTopRatedReviewsService = exports.getCustomerReviewStatsService = exports.getBranchReviewStatsService = void 0;
const reviewRepository_1 = require("../../repository/reviewRepository");
const checkBranchAccessHelper_1 = require("../../helper/checkBranchAccessHelper");
const database_1 = require("../../database");
/**
 * Get review statistics for a branch
 */
const getBranchReviewStatsService = async (payload) => {
    const { userId, role, branchId } = payload;
    // Check access rights
    if (role === "admin") {
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
        if (!hasAccess) {
            throw new Error("Anda tidak memiliki akses ke branch ini");
        }
    }
    else if (role === "owner") {
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        const branchIds = owner?.branches.map((b) => b.id) || [];
        if (!branchIds.includes(branchId)) {
            throw new Error("Anda tidak memiliki akses ke branch ini");
        }
    }
    const { stats, ratingDistribution } = await reviewRepository_1.ReviewRepository.getAggregateByBranch(branchId);
    const totalCount = typeof stats._count === "object" ? stats._count.id : stats._count;
    return {
        totalReviews: totalCount,
        averageRating: stats._avg?.rating
            ? Math.round(stats._avg.rating * 100) / 100
            : 0,
        minRating: stats._min?.rating || 0,
        maxRating: stats._max?.rating || 0,
        ratingDistribution: ratingDistribution.map((rd) => ({
            rating: rd.rating,
            count: typeof rd._count === "object" ? rd._count.id : rd._count,
            percentage: totalCount > 0
                ? ((typeof rd._count === "object"
                    ? rd._count.id
                    : rd._count) /
                    totalCount) *
                    100
                : 0,
        })),
    };
};
exports.getBranchReviewStatsService = getBranchReviewStatsService;
/**
 * Get review statistics for a customer
 */
const getCustomerReviewStatsService = async (payload) => {
    const { userId, role, customerId } = payload;
    let targetCustomerId;
    if (role === "customer") {
        // Customer can only see their own stats
        targetCustomerId = userId;
    }
    else if (customerId) {
        // Admin/Owner can see other customers' stats (optional)
        targetCustomerId = customerId;
    }
    else {
        throw new Error("Customer ID diperlukan");
    }
    const stats = await reviewRepository_1.ReviewRepository.getAggregateByCustomer(targetCustomerId);
    const totalCount = typeof stats._count === "object" ? stats._count.id : stats._count;
    return {
        totalReviews: totalCount,
        averageRating: stats._avg?.rating
            ? Math.round(stats._avg.rating * 100) / 100
            : 0,
    };
};
exports.getCustomerReviewStatsService = getCustomerReviewStatsService;
/**
 * Get top rated reviews for a branch
 */
const getTopRatedReviewsService = async (payload) => {
    const { userId, role, branchId, limit = 5 } = payload;
    // Check access rights
    if (role === "admin") {
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
        if (!hasAccess) {
            throw new Error("Anda tidak memiliki akses ke branch ini");
        }
    }
    else if (role === "owner") {
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        const branchIds = owner?.branches.map((b) => b.id) || [];
        if (!branchIds.includes(branchId)) {
            throw new Error("Anda tidak memiliki akses ke branch ini");
        }
    }
    const reviews = await reviewRepository_1.ReviewRepository.findMany({
        branchId: branchId,
        rating: {
            gte: 4,
        },
    }, 0, limit);
    return reviews;
};
exports.getTopRatedReviewsService = getTopRatedReviewsService;
/**
 * Get low rated reviews for a branch (for improvement tracking)
 */
const getLowRatedReviewsService = async (payload) => {
    const { userId, role, branchId, limit = 5 } = payload;
    // Check access rights
    if (role === "admin") {
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
        if (!hasAccess) {
            throw new Error("Anda tidak memiliki akses ke branch ini");
        }
    }
    else if (role === "owner") {
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        const branchIds = owner?.branches.map((b) => b.id) || [];
        if (!branchIds.includes(branchId)) {
            throw new Error("Anda tidak memiliki akses ke branch ini");
        }
    }
    const reviews = await reviewRepository_1.ReviewRepository.findMany({
        branchId: branchId,
        rating: {
            lte: 2,
        },
    }, 0, limit);
    return reviews;
};
exports.getLowRatedReviewsService = getLowRatedReviewsService;
/**
 * Get recent reviews for a branch
 */
const getRecentReviewsService = async (payload) => {
    const { userId, role, branchId, limit = 10 } = payload;
    // Check access rights
    if (role === "admin") {
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
        if (!hasAccess) {
            throw new Error("Anda tidak memiliki akses ke branch ini");
        }
    }
    else if (role === "owner") {
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        const branchIds = owner?.branches.map((b) => b.id) || [];
        if (!branchIds.includes(branchId)) {
            throw new Error("Anda tidak memiliki akses ke branch ini");
        }
    }
    const reviews = await reviewRepository_1.ReviewRepository.findMany({
        branchId: branchId,
    }, 0, limit);
    return reviews;
};
exports.getRecentReviewsService = getRecentReviewsService;
//# sourceMappingURL=reviewAggregationService.js.map