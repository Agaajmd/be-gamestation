interface AddGamesToDevicePayload {
    branchId: bigint;
    roomAndDeviceId: bigint;
    userId: bigint;
    gameIds: bigint[];
}
interface RemoveGamesFromDevicePayload {
    branchId: bigint;
    roomAndDeviceId: bigint;
    userId: bigint;
    gameIds: bigint[];
}
export declare function addGamesToDeviceService(payload: AddGamesToDevicePayload): Promise<{
    roomAndDevice: {
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
    };
    addedCount: number;
    totalRequested: number;
    skippedCount: number;
    games: {
        id: string;
        gameId: string;
        name: string;
        deviceType: import("@prisma/client").$Enums.DeviceType | null;
    }[];
}>;
export declare function removeGamesFromDeviceService(payload: RemoveGamesFromDevicePayload): Promise<{
    roomAndDeviceId: string;
    deviceName: string;
    roomNumber: string | null;
    deletedCount: number;
    totalRequested: number;
}>;
export {};
//# sourceMappingURL=gameAvailabilityService.d.ts.map