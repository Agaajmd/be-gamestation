import { Prisma } from "@prisma/client";
export declare const RoomAndDeviceConfig: {
    include: {
        category: true;
        orderItems: {
            include: {
                order: {
                    select: {
                        status: true;
                    };
                };
            };
        };
        availabilityExceptions: true;
    };
    orderBy: {
        roomNumber: "asc";
    };
};
export type RoomAndDeviceWithRelations = Prisma.roomAndDeviceGetPayload<typeof RoomAndDeviceConfig>;
export declare const RoomAndDeviceWithSessionsConfig: {
    include: {
        _count: {
            select: {
                sessions: true;
                orderItems: true;
            };
        };
    };
};
export type RoomAndDeviceWithSessions = Prisma.roomAndDeviceGetPayload<typeof RoomAndDeviceWithSessionsConfig>;
//# sourceMappingURL=roomAndDevice.d.ts.map