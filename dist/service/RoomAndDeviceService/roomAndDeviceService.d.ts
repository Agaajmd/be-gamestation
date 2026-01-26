/**
 * Add room and device to branch
 */
export declare const addRoomAndDeviceService: (payload: {
    userId: bigint;
    branchId: bigint;
    categoryId: bigint;
    name: string;
    deviceType: string;
    version: string;
    pricePerHour: number;
    roomNumber: string;
}) => Promise<{
    _count: {
        orderItems: number;
        sessions: number;
    };
    category: {
        name: string;
        id: bigint;
        branchId: bigint;
        tier: import("@prisma/client").$Enums.CategoryTier;
    } | null;
    orderItems: {
        id: bigint;
        bookingStart: Date;
        bookingEnd: Date;
    }[];
    games: {
        game: {
            name: string;
            id: bigint;
            deviceType: import("@prisma/client").$Enums.DeviceType | null;
        };
    }[];
} & {
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
}>;
/**
 * Get rooms and devices by branch with filters
 */
export declare const getRoomsAndDevicesService: (payload: {
    branchId: bigint;
    deviceType?: string;
    status?: string;
    categoryId?: bigint;
    search?: string;
    skip?: number;
    take?: number;
}) => Promise<{
    devices: ({
        _count: {
            orderItems: number;
            sessions: number;
        };
        category: {
            name: string;
            id: bigint;
            branchId: bigint;
            tier: import("@prisma/client").$Enums.CategoryTier;
        } | null;
        orderItems: {
            id: bigint;
            bookingStart: Date;
            bookingEnd: Date;
        }[];
        games: {
            game: {
                name: string;
                id: bigint;
                deviceType: import("@prisma/client").$Enums.DeviceType | null;
            };
        }[];
    } & {
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
    })[];
    total: number;
}>;
/**
 * Get room and device details by ID
 */
export declare const getRoomAndDeviceDetailsService: (payload: {
    roomAndDeviceId: bigint;
    branchId: bigint;
}) => Promise<{
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
} | null>;
/**
 * Update room and device
 */
export declare const updateRoomAndDeviceService: (payload: {
    userId: bigint;
    branchId: bigint;
    roomAndDeviceId: bigint;
    categoryId?: bigint;
    name?: string;
    deviceType?: string;
    version?: string;
    pricePerHour?: number;
    roomNumber?: string;
    status?: string;
}) => Promise<{
    _count: {
        orderItems: number;
        sessions: number;
    };
    category: {
        name: string;
        id: bigint;
        branchId: bigint;
        tier: import("@prisma/client").$Enums.CategoryTier;
    } | null;
    orderItems: {
        id: bigint;
        bookingStart: Date;
        bookingEnd: Date;
    }[];
    games: {
        game: {
            name: string;
            id: bigint;
            deviceType: import("@prisma/client").$Enums.DeviceType | null;
        };
    }[];
} & {
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
}>;
/**
 * Delete room and device
 */
export declare const deleteRoomAndDeviceService: (payload: {
    userId: bigint;
    branchId: bigint;
    roomAndDeviceId: bigint;
}) => Promise<{
    success: boolean;
}>;
//# sourceMappingURL=roomAndDeviceService.d.ts.map