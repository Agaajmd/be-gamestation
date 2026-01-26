"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const database_1 = require("../database");
const reviewInclude = {
    branch: {
        select: {
            id: true,
            name: true,
        },
    },
    customer: {
        select: {
            id: true,
            email: true,
            fullname: true,
        },
    },
};
exports.ReviewRepository = {
    // Find review by ID
    findById(reviewId) {
        return database_1.prisma.review.findUnique({
            where: { id: reviewId },
            include: reviewInclude,
        });
    },
    // Find review by customer and branch (for duplicate check)
    findByCustomerAndBranch(customerId, branchId) {
        return database_1.prisma.review.findFirst({
            where: {
                customerId,
                branchId,
            },
            include: reviewInclude,
        });
    },
    // Find many reviews with filters
    findMany(where, skip, take) {
        return database_1.prisma.review.findMany({
            where,
            include: reviewInclude,
            skip,
            take,
            orderBy: { createdAt: "desc" },
        });
    },
    // Count reviews
    count(where) {
        return database_1.prisma.review.count({ where });
    },
    // Find first matching criteria
    findFirst(where) {
        return database_1.prisma.review.findFirst({
            where,
            include: reviewInclude,
        });
    },
    // Create review
    create(data) {
        return database_1.prisma.review.create({
            data,
            include: reviewInclude,
        });
    },
    // Update review
    update(reviewId, data) {
        return database_1.prisma.review.update({
            where: { id: reviewId },
            data,
            include: reviewInclude,
        });
    },
    // Delete review
    delete(reviewId) {
        return database_1.prisma.review.delete({
            where: { id: reviewId },
        });
    },
    // Get aggregated stats by branch
    async getAggregateByBranch(branchId) {
        const result = await database_1.prisma.review.aggregate({
            where: {
                branchId: branchId,
            },
            _avg: {
                rating: true,
            },
            _count: {
                id: true,
            },
            _min: {
                rating: true,
            },
            _max: {
                rating: true,
            },
        });
        // Get rating distribution
        const ratingCounts = await database_1.prisma.review.groupBy({
            by: ["rating"],
            where: {
                branchId: branchId,
            },
            _count: {
                id: true,
            },
        });
        return {
            stats: result,
            ratingDistribution: ratingCounts,
        };
    },
    // Get aggregated stats by customer
    async getAggregateByCustomer(customerId) {
        const result = await database_1.prisma.review.aggregate({
            where: {
                customerId,
            },
            _avg: {
                rating: true,
            },
            _count: {
                id: true,
            },
        });
        return result;
    },
};
//# sourceMappingURL=reviewRepository.js.map