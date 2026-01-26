export declare const GameAvailabilityRepository: {
    findById(id: bigint): import("@prisma/client").Prisma.Prisma__GameAvailabilityClient<{
        id: bigint;
        createdAt: Date;
        gameId: bigint;
        roomAndDeviceId: bigint;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByRoomAndDeviceId(roomAndDeviceId: bigint): import("@prisma/client").Prisma.PrismaPromise<({
        game: {
            name: string;
            id: bigint;
            createdAt: Date;
            deviceType: import("@prisma/client").$Enums.DeviceType | null;
        };
    } & {
        id: bigint;
        createdAt: Date;
        gameId: bigint;
        roomAndDeviceId: bigint;
    })[]>;
    createMany(data: Array<{
        gameId: bigint;
        roomAndDeviceId: bigint;
    }>): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
    deleteMany(roomAndDeviceId: bigint, gameIds: bigint[]): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
};
//# sourceMappingURL=gameAvailabilityRepository.d.ts.map