export declare const GameAvailabilityQuery: {
    getAddedGamesToDevice(roomAndDeviceId: bigint, gameIds: bigint[]): Promise<({
        game: {
            name: string;
            id: bigint;
            deviceType: import("@prisma/client").$Enums.DeviceType | null;
        };
    } & {
        id: bigint;
        createdAt: Date;
        gameId: bigint;
        roomAndDeviceId: bigint;
    })[]>;
};
//# sourceMappingURL=gameAvailibilityQuery.d.ts.map