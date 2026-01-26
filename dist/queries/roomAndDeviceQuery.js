"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomAndDeviceQuery = void 0;
const client_1 = require("@prisma/client");
const roomAndDeviceRepository_1 = require("../repository/roomAndDeviceRepository");
const roomAndDevice_1 = require("../promise/roomAndDevice");
exports.RoomAndDeviceQuery = {
    async findAvailableRoomAndDevicesByBranchAndCategory(branchId, categoryId) {
        const result = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findManyRoomsAndDevices({
            branchId,
            categoryId,
            status: client_1.RoomAndDeviceStatus.available,
        }, roomAndDevice_1.RoomAndDeviceConfig);
        return result;
    },
    async findUniqueWithCount(id) {
        const result = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findUnique({
            id,
        }, roomAndDevice_1.RoomAndDeviceWithSessionsConfig);
        return result;
    },
};
//# sourceMappingURL=roomAndDeviceQuery.js.map