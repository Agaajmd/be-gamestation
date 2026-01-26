"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGamesToDeviceService = addGamesToDeviceService;
exports.removeGamesFromDeviceService = removeGamesFromDeviceService;
// Repository
const roomAndDeviceRepository_1 = require("../../repository/roomAndDeviceRepository");
const gameRepository_1 = require("../../repository/gameRepository");
const gameAvailabilityRepository_1 = require("../../repository/gameAvailabilityRepository");
// Helper
const checkBranchAccessHelper_1 = require("../../helper/checkBranchAccessHelper");
// Queries
const gameAvailibilityQuery_1 = require("../../queries/gameAvailibilityQuery");
// Errors
const roomAndDeviceError_1 = require("../../errors/RoomAndDeviceError/roomAndDeviceError");
const gameError_1 = require("../../errors/GameError/gameError");
// Service function to add games to device
async function addGamesToDeviceService(payload) {
    const { branchId, roomAndDeviceId, userId, gameIds } = payload;
    // Check authorization
    const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
    if (!hasAccess) {
        throw new Error("Anda tidak memiliki akses ke cabang ini");
    }
    // Verify device exists and belongs to branch
    const roomAndDevice = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findById(roomAndDeviceId, branchId);
    if (!roomAndDevice) {
        throw new roomAndDeviceError_1.RoomAndDeviceNotFoundError();
    }
    // Verify all games exist
    const games = await gameRepository_1.GameRepository.exists(gameIds);
    const foundGameIds = games.map((game) => game.id);
    const missingGameIds = gameIds.filter((id) => !foundGameIds.includes(id));
    if (missingGameIds.length > 0) {
        throw new gameError_1.InvalidGameDataError(missingGameIds);
    }
    // Validate DeviceType compatibility
    const incompatibleGames = games.filter((game) => game.deviceType !== roomAndDevice.deviceType);
    if (incompatibleGames.length > 0) {
        throw new gameError_1.IncompatibleDeviceTypeError(roomAndDevice.deviceType, incompatibleGames);
    }
    // Create game availabilities (skip duplicates)
    const data = gameIds.map((gameId) => ({
        gameId,
        roomAndDeviceId,
    }));
    const result = await gameAvailabilityRepository_1.GameAvailabilityRepository.createMany(data);
    // Get created games for response
    const createdGames = await gameAvailibilityQuery_1.GameAvailabilityQuery.getAddedGamesToDevice(roomAndDeviceId, gameIds);
    return {
        roomAndDevice,
        addedCount: result.count,
        totalRequested: gameIds.length,
        skippedCount: gameIds.length - result.count,
        games: createdGames.map((ga) => ({
            id: ga.id.toString(),
            gameId: ga.game.id.toString(),
            name: ga.game.name,
            deviceType: ga.game.deviceType,
        })),
    };
}
// Service function to remove games from device
async function removeGamesFromDeviceService(payload) {
    const { branchId, roomAndDeviceId, userId, gameIds } = payload;
    // Check authorization
    const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
    if (!hasAccess) {
        throw new Error("Anda tidak memiliki akses ke cabang ini");
    }
    // Verify device exists and belongs to branch
    const roomAndDevice = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findById(roomAndDeviceId, branchId);
    if (!roomAndDevice) {
        throw new roomAndDeviceError_1.RoomAndDeviceNotFoundError();
    }
    // Delete game availabilities
    const result = await gameAvailabilityRepository_1.GameAvailabilityRepository.deleteMany(roomAndDeviceId, gameIds);
    return {
        roomAndDeviceId: roomAndDevice.id.toString(),
        deviceName: roomAndDevice.name,
        roomNumber: roomAndDevice.roomNumber,
        deletedCount: result.count,
        totalRequested: gameIds.length,
    };
}
//# sourceMappingURL=gameAvailabilityService.js.map