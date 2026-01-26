"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomAndDeviceWithSessionsConfig = exports.RoomAndDeviceConfig = void 0;
exports.RoomAndDeviceConfig = {
    include: {
        category: true,
        orderItems: {
            include: {
                order: {
                    select: { status: true },
                },
            },
        },
        availabilityExceptions: true,
    },
    orderBy: { roomNumber: "asc" },
};
exports.RoomAndDeviceWithSessionsConfig = {
    include: {
        _count: {
            select: {
                sessions: true,
                orderItems: true,
            },
        },
    },
};
//# sourceMappingURL=roomAndDevice.js.map