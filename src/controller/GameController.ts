import { Request, Response } from "express";
import prisma from "../lib/prisma";

/**
 * GET /games
 * Get list game (public endpoint)
 */
export const getGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const { platform } = req.query;

    const games = await prisma.game.findMany({
      where: platform ? { platform: platform as any } : undefined,
      orderBy: {
        name: "asc",
      },
    });

    const serializedGames = JSON.parse(
      JSON.stringify(games, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedGames,
    });
  } catch (error) {
    console.error("Get games error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data game",
    });
  }
};

/**
 * GET /games/:id
 * Get game by ID
 */
export const getGameById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const gameId = BigInt(req.params.id);

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      res.status(404).json({
        success: false,
        message: "Game tidak ditemukan",
      });
      return;
    }

    const serializedGame = JSON.parse(
      JSON.stringify(game, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedGame,
    });
  } catch (error) {
    console.error("Get game by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data game",
    });
  }
};

/**
 * POST /games
 * Create new game (owner/admin only)
 */
export const createGame = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, platform } = req.body;

    // Check if game with same name and platform already exists
    const existingGame = await prisma.game.findFirst({
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

    const game = await prisma.game.create({
      data: {
        name,
        platform,
      },
    });

    const serializedGame = JSON.parse(
      JSON.stringify(game, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(201).json({
      success: true,
      message: "Game berhasil ditambahkan",
      data: serializedGame,
    });
  } catch (error) {
    console.error("Create game error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan game",
    });
  }
};

/**
 * PUT /games/:id
 * Update game (owner/admin only)
 */
export const updateGame = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const gameId = BigInt(req.params.id);
    const { name, platform } = req.body;

    const game = await prisma.game.findUnique({
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
      const existingGame = await prisma.game.findFirst({
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

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        ...(name && { name }),
        ...(platform && { platform }),
      },
    });

    const serializedGame = JSON.parse(
      JSON.stringify(updatedGame, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      message: "Game berhasil diupdate",
      data: serializedGame,
    });
  } catch (error) {
    console.error("Update game error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate game",
    });
  }
};

/**
 * DELETE /games/:id
 * Delete game (owner only)
 */
export const deleteGame = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const gameId = BigInt(req.params.id);

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      res.status(404).json({
        success: false,
        message: "Game tidak ditemukan",
      });
      return;
    }

    await prisma.game.delete({
      where: { id: gameId },
    });

    res.status(200).json({
      success: true,
      message: "Game berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete game error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus game",
    });
  }
};
