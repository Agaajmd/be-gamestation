"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeGamesFromDevice = exports.addGamesToDevice = void 0;
// Services
const gameAvailabilityService_1 = require("../service/GameAvailabilityService/gameAvailabilityService");
// Error
const responseHelper_1 = require("../helper/responseHelper");
/**
 * POST /branches/:branchId/rooms-and-devices/:roomAndDeviceId/games
 * Menambahkan 1 atau lebih game ke device
 */
const addGamesToDevice = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
        const userId = BigInt(req.user.userId);
        const { gameIds } = req.body;
        // Convert to array if single gameId
        const gameIdsArray = Array.isArray(gameIds) ? gameIds : [gameIds];
        const result = await (0, gameAvailabilityService_1.addGamesToDeviceService)({
            branchId,
            roomAndDeviceId,
            userId,
            gameIds: gameIdsArray.map((id) => BigInt(id)),
        });
        res.status(201).json({
            success: true,
            message: `${result.addedCount} game berhasil ditambahkan ke device`,
            data: result,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.addGamesToDevice = addGamesToDevice;
/**
 * DELETE /branches/:branchId/rooms-and-devices/:roomAndDeviceId/games
 * Menghapus 1 atau lebih game dari device
 */
const removeGamesFromDevice = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
        const userId = BigInt(req.user.userId);
        const { gameIds } = req.body;
        // Convert to array if single gameId
        const gameIdsArray = Array.isArray(gameIds) ? gameIds : [gameIds];
        const result = await (0, gameAvailabilityService_1.removeGamesFromDeviceService)({
            branchId,
            roomAndDeviceId,
            userId,
            gameIds: gameIdsArray.map((id) => BigInt(id)),
        });
        res.status(200).json({
            success: true,
            message: `${result.deletedCount} game berhasil dihapus dari device`,
            data: result,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.removeGamesFromDevice = removeGamesFromDevice;
//# sourceMappingURL=GameAvailabilityController.js.map