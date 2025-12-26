"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGame = exports.updateGame = exports.createGame = exports.getGameById = exports.getGames = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
/**
 * GET /games
 * Get list game (public endpoint)
 */
const getGames = async (req, res) => {
    try {
        const { platform } = req.query;
        const games = await prisma_1.default.game.findMany({
            where: platform ? { platform: platform } : undefined,
            orderBy: {
                name: "asc",
            },
        });
        const serializedGames = JSON.parse(JSON.stringify(games, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            data: serializedGames,
        });
    }
    catch (error) {
        console.error("Get games error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data game",
        });
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
        const game = await prisma_1.default.game.findUnique({
            where: { id: gameId },
        });
        if (!game) {
            res.status(404).json({
                success: false,
                message: "Game tidak ditemukan",
            });
            return;
        }
        const serializedGame = JSON.parse(JSON.stringify(game, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            data: serializedGame,
        });
    }
    catch (error) {
        console.error("Get game by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data game",
        });
    }
};
exports.getGameById = getGameById;
/**
 * POST /games
 * Create new game (owner/admin only)
 */
const createGame = async (req, res) => {
    try {
        const { name, platform } = req.body;
        // Check if game with same name and platform already exists
        const existingGame = await prisma_1.default.game.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                platform,
            },
        });
        if (existingGame) {
            res.status(400).json({
                success: false,
                message: "Game dengan nama dan platform yang sama sudah ada",
            });
            return;
        }
        const game = await prisma_1.default.game.create({
            data: {
                name,
                platform,
            },
        });
        const serializedGame = JSON.parse(JSON.stringify(game, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(201).json({
            success: true,
            message: "Game berhasil ditambahkan",
            data: serializedGame,
        });
    }
    catch (error) {
        console.error("Create game error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menambahkan game",
        });
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
        const { name, platform } = req.body;
        const game = await prisma_1.default.game.findUnique({
            where: { id: gameId },
        });
        if (!game) {
            res.status(404).json({
                success: false,
                message: "Game tidak ditemukan",
            });
            return;
        }
        // Check if game with same name and platform already exists (excluding current game)
        if (name && platform) {
            const existingGame = await prisma_1.default.game.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: "insensitive",
                    },
                    platform,
                    id: { not: gameId },
                },
            });
            if (existingGame) {
                res.status(400).json({
                    success: false,
                    message: "Game dengan nama dan platform yang sama sudah ada",
                });
                return;
            }
        }
        const updatedGame = await prisma_1.default.game.update({
            where: { id: gameId },
            data: {
                ...(name && { name }),
                ...(platform && { platform }),
            },
        });
        const serializedGame = JSON.parse(JSON.stringify(updatedGame, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            message: "Game berhasil diupdate",
            data: serializedGame,
        });
    }
    catch (error) {
        console.error("Update game error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengupdate game",
        });
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
        const game = await prisma_1.default.game.findUnique({
            where: { id: gameId },
        });
        if (!game) {
            res.status(404).json({
                success: false,
                message: "Game tidak ditemukan",
            });
            return;
        }
        await prisma_1.default.game.delete({
            where: { id: gameId },
        });
        res.status(200).json({
            success: true,
            message: "Game berhasil dihapus",
        });
    }
    catch (error) {
        console.error("Delete game error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus game",
        });
    }
};
exports.deleteGame = deleteGame;
//# sourceMappingURL=GameController.js.map