/**
 * Get review statistics for a branch
 */
export declare const getBranchReviewStatsService: (payload: {
    userId: bigint;
    role: string;
    branchId: bigint;
}) => Promise<{
    totalReviews: any;
    averageRating: number;
    minRating: number;
    maxRating: number;
    ratingDistribution: {
        rating: number;
        count: any;
        percentage: number;
    }[];
}>;
/**
 * Get review statistics for a customer
 */
export declare const getCustomerReviewStatsService: (payload: {
    userId: bigint;
    role: string;
    customerId?: bigint;
}) => Promise<{
    totalReviews: any;
    averageRating: number;
}>;
/**
 * Get top rated reviews for a branch
 */
export declare const getTopRatedReviewsService: (payload: {
    userId: bigint;
    role: string;
    branchId: bigint;
    limit?: number;
}) => Promise<({
    customer: {
        id: bigint;
        email: string;
        fullname: string;
    };
    branch: {
        name: string;
        id: bigint;
    };
} & {
    id: bigint;
    createdAt: Date;
    updatedAt: Date;
    customerId: bigint;
    branchId: bigint;
    rating: number;
    comment: string | null;
})[]>;
/**
 * Get low rated reviews for a branch (for improvement tracking)
 */
export declare const getLowRatedReviewsService: (payload: {
    userId: bigint;
    role: string;
    branchId: bigint;
    limit?: number;
}) => Promise<({
    customer: {
        id: bigint;
        email: string;
        fullname: string;
    };
    branch: {
        name: string;
        id: bigint;
    };
} & {
    id: bigint;
    createdAt: Date;
    updatedAt: Date;
    customerId: bigint;
    branchId: bigint;
    rating: number;
    comment: string | null;
})[]>;
/**
 * Get recent reviews for a branch
 */
export declare const getRecentReviewsService: (payload: {
    userId: bigint;
    role: string;
    branchId: bigint;
    limit?: number;
}) => Promise<({
    customer: {
        id: bigint;
        email: string;
        fullname: string;
    };
    branch: {
        name: string;
        id: bigint;
    };
} & {
    id: bigint;
    createdAt: Date;
    updatedAt: Date;
    customerId: bigint;
    branchId: bigint;
    rating: number;
    comment: string | null;
})[]>;
//# sourceMappingURL=reviewAggregationService.d.ts.map