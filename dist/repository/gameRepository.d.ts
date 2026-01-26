import { DeviceType } from "@prisma/client";
export declare const GameRepository: {
    findMany(deviceType?: DeviceType): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: bigint;
        createdAt: Date;
        deviceType: import("@prisma/client").$Enums.DeviceType | null;
    }[]>;
    findById(gameId: bigint): import("@prisma/client").Prisma.Prisma__GameClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        deviceType: import("@prisma/client").$Enums.DeviceType | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByNameAndDeviceType(name: string, deviceType: DeviceType): import("@prisma/client").Prisma.Prisma__GameClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        deviceType: import("@prisma/client").$Enums.DeviceType | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByNameAndDeviceTypeExcluding(name: string, deviceType: DeviceType, excludeId: bigint): import("@prisma/client").Prisma.Prisma__GameClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        deviceType: import("@prisma/client").$Enums.DeviceType | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    exists(gameIds: bigint[]): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: bigint;
        deviceType: import("@prisma/client").$Enums.DeviceType | null;
    }[]>;
    create(data: {
        name: string;
        deviceType: DeviceType;
    }): import("@prisma/client").Prisma.Prisma__GameClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        deviceType: import("@prisma/client").$Enums.DeviceType | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(gameId: bigint, data: {
        name?: string;
        deviceType?: DeviceType;
    }): import("@prisma/client").Prisma.Prisma__GameClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        deviceType: import("@prisma/client").$Enums.DeviceType | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(gameId: bigint): import("@prisma/client").Prisma.Prisma__GameClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        deviceType: import("@prisma/client").$Enums.DeviceType | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=gameRepository.d.ts.map