export declare const ReviewRepository: {
    findById(reviewId: bigint): import("@prisma/client").Prisma.Prisma__ReviewClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByCustomerAndBranch(customerId: bigint, branchId: bigint): import("@prisma/client").Prisma.Prisma__ReviewClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findMany(where: any, skip?: number, take?: number): import("@prisma/client").Prisma.PrismaPromise<({
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
    count(where: any): import("@prisma/client").Prisma.PrismaPromise<number>;
    findFirst(where: any): import("@prisma/client").Prisma.Prisma__ReviewClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(data: any): import("@prisma/client").Prisma.Prisma__ReviewClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(reviewId: bigint, data: any): import("@prisma/client").Prisma.Prisma__ReviewClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(reviewId: bigint): import("@prisma/client").Prisma.Prisma__ReviewClient<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        customerId: bigint;
        branchId: bigint;
        rating: number;
        comment: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getAggregateByBranch(branchId: bigint): Promise<{
        stats: import("@prisma/client").Prisma.GetReviewAggregateType<{
            where: any;
            _avg: {
                rating: true;
            };
            _count: {
                id: true;
            };
            _min: {
                rating: true;
            };
            _max: {
                rating: true;
            };
        }>;
        ratingDistribution: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.ReviewGroupByOutputType, "rating"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
    getAggregateByCustomer(customerId: bigint): Promise<import("@prisma/client").Prisma.GetReviewAggregateType<{
        where: {
            customerId: bigint;
        };
        _avg: {
            rating: true;
        };
        _count: {
            id: true;
        };
    }>>;
};
//# sourceMappingURL=reviewRepository.d.ts.map