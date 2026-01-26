"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameAvailabilityQuery = void 0;
const database_1 = require("../database");
exports.GameAvailabilityQuery = {
    async getAddedGamesToDevice(roomAndDeviceId, gameIds) {
        const result = await database_1.prisma.gameAvailability.findMany({
            where: {
                roomAndDeviceId,
                gameId: {
                    in: gameIds,
                },
            },
            include: {
                game: {
                    select: {
                        id: true,
                        name: true,
                        deviceType: true,
                    },
                },
            },
        });
        return result;
    },
};
//# sourceMappingURL=gameAvailibilityQuery.js.map