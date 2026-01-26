export declare const AdvanceBookingPriceRepository: {
    findFirst(where: object, options?: object): import("@prisma/client").Prisma.Prisma__AdvanceBookingPriceClient<{
        id: bigint;
        createdAt: Date;
        branchId: bigint;
        minDays: number;
        maxDays: number;
        additionalFee: import("@prisma/client-runtime-utils").Decimal;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findOne(branchId: bigint, minDays: number, maxDays: number | null): import("@prisma/client").Prisma.Prisma__AdvanceBookingPriceClient<{
        id: bigint;
        createdAt: Date;
        branchId: bigint;
        minDays: number;
        maxDays: number;
        additionalFee: import("@prisma/client-runtime-utils").Decimal;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByBranchId(branchId: bigint): import("@prisma/client").Prisma.PrismaPromise<{
        id: bigint;
        createdAt: Date;
        branchId: bigint;
        minDays: number;
        maxDays: number;
        additionalFee: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: bigint;
        createdAt: Date;
        branchId: bigint;
        minDays: number;
        maxDays: number;
        additionalFee: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    findById(id: bigint): import("@prisma/client").Prisma.Prisma__AdvanceBookingPriceClient<{
        id: bigint;
        createdAt: Date;
        branchId: bigint;
        minDays: number;
        maxDays: number;
        additionalFee: import("@prisma/client-runtime-utils").Decimal;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(data: {
        branchId: bigint;
        minDays: number;
        maxDays: number | null;
        additionalFee: number;
    }): import("@prisma/client").Prisma.Prisma__AdvanceBookingPriceClient<{
        id: bigint;
        createdAt: Date;
        branchId: bigint;
        minDays: number;
        maxDays: number;
        additionalFee: import("@prisma/client-runtime-utils").Decimal;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: bigint, data: {
        minDays?: number;
        maxDays?: number | null;
        additionalFee?: number;
    }): import("@prisma/client").Prisma.Prisma__AdvanceBookingPriceClient<{
        id: bigint;
        createdAt: Date;
        branchId: bigint;
        minDays: number;
        maxDays: number;
        additionalFee: import("@prisma/client-runtime-utils").Decimal;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(id: bigint): import("@prisma/client").Prisma.Prisma__AdvanceBookingPriceClient<{
        id: bigint;
        createdAt: Date;
        branchId: bigint;
        minDays: number;
        maxDays: number;
        additionalFee: import("@prisma/client-runtime-utils").Decimal;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=advanceBookingPriceRepository.d.ts.map