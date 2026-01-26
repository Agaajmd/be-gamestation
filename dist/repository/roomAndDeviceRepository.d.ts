export declare const RoomAndDeviceRepository: {
    findFirst(where: object, options?: object): import("@prisma/client").Prisma.Prisma__roomAndDeviceClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findUnique(where: any, options?: object): import("@prisma/client").Prisma.Prisma__roomAndDeviceClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(id: bigint, branchId?: bigint): import("@prisma/client").Prisma.Prisma__roomAndDeviceClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findMany(where: object, skip?: number, take?: number): import("@prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    count(where: object, options?: object): import("@prisma/client").Prisma.PrismaPromise<number>;
    findAvailableByBranchId(branchId: bigint): import("@prisma/client").Prisma.PrismaPromise<{
        id: bigint;
    }[]>;
    findByBranchIdWithOrdersAndExceptions(branchId: bigint, targetDate: Date, branchOpenTime: number, branchCloseTime: number): import("@prisma/client").Prisma.PrismaPromise<({
        orderItems: {
            id: bigint;
            createdAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            roomAndDeviceId: bigint;
            orderId: bigint;
            bookingStart: Date;
            bookingEnd: Date;
            durationMinutes: number;
            baseAmount: import("@prisma/client-runtime-utils").Decimal;
            categoryFee: import("@prisma/client-runtime-utils").Decimal;
            advanceBookingFee: import("@prisma/client-runtime-utils").Decimal;
        }[];
        availabilityExceptions: {
            id: bigint;
            roomAndDeviceId: bigint;
            startAt: Date;
            endAt: Date;
            reason: string | null;
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
    })[]>;
    findRoomsAndDevicesByBranchId(branchId: bigint): import("@prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findManyRoomsAndDevices(where: object, options: object): import("@prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    create(data: any): import("@prisma/client").Prisma.Prisma__roomAndDeviceClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: bigint, data: any): import("@prisma/client").Prisma.Prisma__roomAndDeviceClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateStatus(id: bigint, status: string): import("@prisma/client").Prisma.Prisma__roomAndDeviceClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(id: bigint): import("@prisma/client").Prisma.Prisma__roomAndDeviceClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=roomAndDeviceRepository.d.ts.map