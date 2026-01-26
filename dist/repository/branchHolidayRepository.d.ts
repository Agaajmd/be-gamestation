export declare const BranchHolidayRepository: {
    findMany(where: object, options?: object): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: bigint;
        createdAt: Date;
        branchId: bigint;
        description: string | null;
        date: Date;
    }[]>;
    createMany(data: Array<{
        branchId: bigint;
        date: Date;
        name: string;
        description: string;
    }>): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
    updateMany(where: object, data: object, options?: object): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
};
//# sourceMappingURL=branchHolidayRepository.d.ts.map