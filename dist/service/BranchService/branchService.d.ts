export declare function createBranchService(payload: {
    userId: bigint;
    name: string;
    address: string;
    phone: string;
    timeZone: string;
    openTime: string;
    closeTime: string;
    facilities: string[];
}): Promise<{
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
}>;
export declare function getAllBranchesService(userId: bigint): Promise<{
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
export declare function getBranchByIdService(payload: {
    branchId: bigint;
    userId: bigint;
}): Promise<{
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
}>;
export declare function updateBranchService(payload: {
    branchId: bigint;
    userId: bigint;
    name?: string;
    address?: string;
    phone?: string;
    timezone?: string;
    openTime?: string;
    closeTime?: string;
    facilities?: any;
}): Promise<{
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
}>;
export declare function deleteBranchService(payload: {
    branchId: bigint;
    userId: bigint;
}): Promise<{
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
}>;
//# sourceMappingURL=branchService.d.ts.map