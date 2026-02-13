"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGamesService = getGamesService;
exports.getGameByIdService = getGameByIdService;
exports.createGameService = createGameService;
exports.updateGameService = updateGameService;
exports.deleteGameService = deleteGameService;
// Repository
const gameRepository_1 = require("../../repository/gameRepository");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Errors
const gameError_1 = require("../../errors/GameError/gameError");
// Service function to get all games
async function getGamesService(deviceType) {
    const games = await gameRepository_1.GameRepository.findMany(deviceType);
    return games;
}
// Service function to get game by ID
async function getGameByIdService(gameId) {
    const game = await gameRepository_1.GameRepository.findById(gameId);
    if (!game) {
        throw new gameError_1.GameNotFoundError();
    }
    return game;
}
// Service function to create a new game
async function createGameService(payload) {
    const { name: rawName, deviceType } = payload;
    // Sanitize input
    const name = (0, inputSanitizer_1.sanitizeString)(rawName);
    // Check if game with same name and deviceType already exists
    const existingGame = await gameRepository_1.GameRepository.findByNameAndDeviceType(name, deviceType);
    if (existingGame) {
        throw new gameError_1.GameAlreadyExistsError();
    }
    const game = await gameRepository_1.GameRepository.create({
        name,
        deviceType: deviceType,
    });
    return game;
}
// Service function to update a game
async function updateGameService(payload) {
    const { gameId, name: rawName, deviceType } = payload;
    // Sanitize input
    const name = rawName ? (0, inputSanitizer_1.sanitizeString)(rawName) : undefined;
    // Check if game exists
    const game = await gameRepository_1.GameRepository.findById(gameId);
    if (!game) {
        throw new gameError_1.GameNotFoundError();
    }
    // Check if game with same name and deviceType already exists (excluding current game)
    if (name && deviceType) {
        const existingGame = await gameRepository_1.GameRepository.findByNameAndDeviceTypeExcluding(name, deviceType, gameId);
        if (existingGame) {
            throw new gameError_1.GameAlreadyExistsError();
        }
    }
    const updatedGame = await gameRepository_1.GameRepository.update(gameId, {
        name,
        deviceType,
    });
    return updatedGame;
}
// Service function to delete a game
async function deleteGameService(gameId) {
    // Check if game exists
    const game = await gameRepository_1.GameRepository.findById(gameId);
    if (!game) {
        throw new Error("Game tidak ditemukan");
    }
    await gameRepository_1.GameRepository.delete(gameId);
    return game;
}
//# sourceMappingURL=gameService.js.map