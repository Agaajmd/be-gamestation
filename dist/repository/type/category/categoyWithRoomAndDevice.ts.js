"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryWithRoomAndDeviceConfig = void 0;
exports.CategoryWithRoomAndDeviceConfig = {
    include: {
        roomAndDevices: {
            where: {
                status: "available",
            },
            select: {
                id: true,
                deviceType: true,
                version: true,
            },
        },
    },
    orderBy: { tier: "asc" },
};
//# sourceMappingURL=categoyWithRoomAndDevice.ts.js.map