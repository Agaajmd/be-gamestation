import { BranchWithCountRoomAndDevice } from "../repository/type/branch/branchWithCountRoomAndDevice";
export declare const BranchRepository: {
    findById(branchId: bigint): import("@prisma/client").Prisma.Prisma__BranchClient<{
        name: string;
        id: bigint;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        ownerId: bigint;
        address: string | null;
        timezone: string;
        openTime: Date | null;
        closeTime: Date | null;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findBranch(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: bigint;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        ownerId: bigint;
        address: string | null;
        timezone: string;
        openTime: Date | null;
        closeTime: Date | null;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    findAll(): Promise<BranchWithCountRoomAndDevice[]>;
    findOpenAndCloseTimeById(branchId: bigint): import("@prisma/client").Prisma.Prisma__BranchClient<{
        openTime: Date | null;
        closeTime: Date | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAvailableBranches(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: bigint;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        ownerId: bigint;
        address: string | null;
        timezone: string;
        openTime: Date | null;
        closeTime: Date | null;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    createBranch(data: {
        ownerId: bigint;
        name: string;
        address: string;
        phone: string;
        timezone: string;
        openTime: Date;
        closeTime: Date;
        amenities?: any;
    }): import("@prisma/client").Prisma.Prisma__BranchClient<{
        name: string;
        id: bigint;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        ownerId: bigint;
        address: string | null;
        timezone: string;
        openTime: Date | null;
        closeTime: Date | null;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findBranchWithDetails(branchId: bigint): import("@prisma/client").Prisma.Prisma__BranchClient<({
        owner: {
            user: {
                email: string;
                fullname: string;
                phone: string | null;
            };
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date | null;
            userId: bigint;
            companyName: string;
        };
        _count: {
            orders: number;
        };
        admins: ({
            user: {
                email: string;
                fullname: string;
                phone: string | null;
            };
        } & {
            id: bigint;
            role: import("@prisma/client").$Enums.AdminRole;
            branchId: bigint;
            userId: bigint;
        })[];
        roomAndDevices: {
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date | null;
            branchId: bigint;
            status: import("@prisma/client").$Enums.RoomAndDeviceStatus;
            pricePerHour: import("@prisma/client-runtime-utils").Decimal;
            categoryId: bigint | null;
            deviceType: import("@prisma/client").$Enums.DeviceType;
            version: import("@prisma/client").$Enums.DeviceVersion | null;
            roomNumber: string | null;
        }[];
    } & {
        name: string;
        id: bigint;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        ownerId: bigint;
        address: string | null;
        timezone: string;
        openTime: Date | null;
        closeTime: Date | null;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findBranchById(branchId: bigint): import("@prisma/client").Prisma.Prisma__BranchClient<{
        name: string;
        id: bigint;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        ownerId: bigint;
        address: string | null;
        timezone: string;
        openTime: Date | null;
        closeTime: Date | null;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findBranchWithCounts(branchId: bigint): import("@prisma/client").Prisma.Prisma__BranchClient<({
        _count: {
            orders: number;
            roomAndDevices: number;
        };
    } & {
        name: string;
        id: bigint;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        ownerId: bigint;
        address: string | null;
        timezone: string;
        openTime: Date | null;
        closeTime: Date | null;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateBranch(branchId: bigint, data: {
        name?: string;
        address?: string;
        phone?: string;
        timezone?: string;
        openTime?: Date;
        closeTime?: Date;
    }): import("@prisma/client").Prisma.Prisma__BranchClient<{
        name: string;
        id: bigint;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        ownerId: bigint;
        address: string | null;
        timezone: string;
        openTime: Date | null;
        closeTime: Date | null;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    deleteBranch(branchId: bigint): import("@prisma/client").Prisma.Prisma__BranchClient<{
        name: string;
        id: bigint;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        ownerId: bigint;
        address: string | null;
        timezone: string;
        openTime: Date | null;
        closeTime: Date | null;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=branchRepository.d.ts.map