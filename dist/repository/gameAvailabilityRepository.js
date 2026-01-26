"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameAvailabilityRepository = void 0;
const database_1 = require("../database");
exports.GameAvailabilityRepository = {
    // Find game availability by ID
    findById(id) {
        return database_1.prisma.gameAvailability.findUnique({
            where: { id },
        });
    },
    // Find many game availabilities for a device
    findByRoomAndDeviceId(roomAndDeviceId) {
        return database_1.prisma.gameAvailability.findMany({
            where: { roomAndDeviceId },
            include: {
                game: true,
            },
        });
    },
    // Create many game availabilities
    createMany(data) {
        return database_1.prisma.gameAvailability.createMany({
            data,
            skipDuplicates: true,
        });
    },
    // Delete many game availabilities
    deleteMany(roomAndDeviceId, gameIds) {
        return database_1.prisma.gameAvailability.deleteMany({
            where: {
                roomAndDeviceId,
                gameId: {
                    in: gameIds,
                },
            },
        });
    },
};
//# sourceMappingURL=gameAvailabilityRepository.js.map