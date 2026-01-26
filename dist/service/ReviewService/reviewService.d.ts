/**
 * Create review (customer only, for branch with at least one completed order)
 */
export declare const createReviewService: (payload: {
    userId: bigint;
    branchId: bigint;
    rating: number;
    comment?: string;
}) => Promise<{
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
}>;
/**
 * Get reviews (role-based filtering)
 */
export declare const getReviewsService: (payload: {
    userId: bigint;
    role: string;
    branchId?: bigint;
    minRating?: number;
    skip?: number;
    take?: number;
}) => Promise<{
    reviews: ({
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
    })[];
    total: number;
}>;
/**
 * Get review by ID (role-based access control)
 */
export declare const getReviewByIdService: (payload: {
    userId: bigint;
    role: string;
    reviewId: bigint;
}) => Promise<{
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
}>;
/**
 * Update review (customer only, own reviews)
 */
export declare const updateReviewService: (payload: {
    userId: bigint;
    reviewId: bigint;
    rating?: number;
    comment?: string;
}) => Promise<{
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
}>;
/**
 * Delete review (customer or admin/owner)
 */
export declare const deleteReviewService: (payload: {
    userId: bigint;
    role: string;
    reviewId: bigint;
}) => Promise<{
    success: boolean;
}>;
//# sourceMappingURL=reviewService.d.ts.map