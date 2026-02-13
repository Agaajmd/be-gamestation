export declare const AnnouncementRepository: {
    findUnique(where: any): import("@prisma/client").Prisma.Prisma__AnnouncementClient<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        title: string;
        content: string;
        forBranch: bigint | null;
        startDate: Date;
        endDate: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(id: bigint): import("@prisma/client").Prisma.Prisma__AnnouncementClient<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        title: string;
        content: string;
        forBranch: bigint | null;
        startDate: Date;
        endDate: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findFirst(where: object, options?: object): import("@prisma/client").Prisma.Prisma__AnnouncementClient<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        title: string;
        content: string;
        forBranch: bigint | null;
        startDate: Date;
        endDate: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findMany(where: object, skip?: number, take?: number, orderBy?: object): import("@prisma/client").Prisma.PrismaPromise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        title: string;
        content: string;
        forBranch: bigint | null;
        startDate: Date;
        endDate: Date;
    }[]>;
    count(where: object): import("@prisma/client").Prisma.PrismaPromise<number>;
    create(data: any): import("@prisma/client").Prisma.Prisma__AnnouncementClient<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        title: string;
        content: string;
        forBranch: bigint | null;
        startDate: Date;
        endDate: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: bigint, data: any): import("@prisma/client").Prisma.Prisma__AnnouncementClient<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        title: string;
        content: string;
        forBranch: bigint | null;
        startDate: Date;
        endDate: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(id: bigint): import("@prisma/client").Prisma.Prisma__AnnouncementClient<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        title: string;
        content: string;
        forBranch: bigint | null;
        startDate: Date;
        endDate: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findActive(branchId?: bigint, skip?: number, take?: number): import("@prisma/client").Prisma.PrismaPromise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        title: string;
        content: string;
        forBranch: bigint | null;
        startDate: Date;
        endDate: Date;
    }[]>;
};
//# sourceMappingURL=announcementRepository.d.ts.map