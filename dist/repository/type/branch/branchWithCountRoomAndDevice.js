"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchWithCountRoomAndDeviceConfig = void 0;
exports.branchWithCountRoomAndDeviceConfig = {
    include: {
        _count: {
            select: {
                roomAndDevices: {
                    where: {
                        status: "available",
                    },
                },
            },
        },
    },
};
//# sourceMappingURL=branchWithCountRoomAndDevice.js.map