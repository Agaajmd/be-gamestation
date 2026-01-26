"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGame = exports.updateGame = exports.createGame = exports.getGameById = exports.getGames = void 0;
// Services
const gameService_1 = require("../service/GameService/gameService");
// Error
const responseHelper_1 = require("../helper/responseHelper");
/**
 * GET /games
 * Get list game (public endpoint)
 */
const getGames = async (req, res) => {
    try {
        const { deviceType } = req.query;
        const games = await (0, gameService_1.getGamesService)(deviceType);
        res.status(200).json({
            success: true,
            data: games,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getGames = getGames;
/**
 * GET /games/:id
 * Get game by ID
 */
const getGameById = async (req, res) => {
    try {
        const gameId = BigInt(req.params.id);
        const game = await (0, gameService_1.getGameByIdService)(gameId);
        res.status(200).json({
            success: true,
            data: game,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getGameById = getGameById;
/**
 * POST /games
 * Create new game (owner/admin only)
 */
const createGame = async (req, res) => {
    try {
        const { name, deviceType } = req.body;
        const game = await (0, gameService_1.createGameService)({
            name,
            deviceType: deviceType,
        });
        res.status(201).json({
            success: true,
            message: "Game berhasil ditambahkan",
            data: game,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.createGame = createGame;
/**
 * PUT /games/:id
 * Update game (owner/admin only)
 */
const updateGame = async (req, res) => {
    try {
        const gameId = BigInt(req.params.id);
        const { name, deviceType } = req.body;
        const updatedGame = await (0, gameService_1.updateGameService)({
            gameId,
            name,
            deviceType: deviceType,
        });
        res.status(200).json({
            success: true,
            message: "Game berhasil diupdate",
            data: updatedGame,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateGame = updateGame;
/**
 * DELETE /games/:id
 * Delete game (owner only)
 */
const deleteGame = async (req, res) => {
    try {
        const gameId = BigInt(req.params.id);
        await (0, gameService_1.deleteGameService)(gameId);
        res.status(200).json({
            success: true,
            message: "Game berhasil dihapus",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.deleteGame = deleteGame;
//# sourceMappingURL=GameController.js.map