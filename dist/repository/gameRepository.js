"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRepository = void 0;
const database_1 = require("../database");
exports.GameRepository = {
    // Find many games with optional deviceType filter
    findMany(deviceType) {
        return database_1.prisma.game.findMany({
            where: deviceType ? { deviceType: deviceType } : undefined,
            orderBy: {
                name: "asc",
            },
        });
    },
    // Find game by ID
    findById(gameId) {
        return database_1.prisma.game.findUnique({
            where: { id: gameId },
        });
    },
    // Find game by name and deviceType
    findByNameAndDeviceType(name, deviceType) {
        return database_1.prisma.game.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                deviceType: deviceType,
            },
        });
    },
    // Find game by name and deviceType excluding specific ID
    findByNameAndDeviceTypeExcluding(name, deviceType, excludeId) {
        return database_1.prisma.game.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                deviceType: deviceType,
                id: { not: excludeId },
            },
        });
    },
    // Verify if game exists by ID
    exists(gameIds) {
        return database_1.prisma.game.findMany({
            where: {
                id: {
                    in: gameIds,
                },
            },
            select: { id: true, name: true, deviceType: true },
        });
    },
    // Create new game
    create(data) {
        return database_1.prisma.game.create({
            data: {
                name: data.name,
                deviceType: data.deviceType,
            },
        });
    },
    // Update game
    update(gameId, data) {
        return database_1.prisma.game.update({
            where: { id: gameId },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.deviceType && { deviceType: data.deviceType }),
            },
        });
    },
    // Delete game
    delete(gameId) {
        return database_1.prisma.game.delete({
            where: { id: gameId },
        });
    },
};
//# sourceMappingURL=gameRepository.js.map