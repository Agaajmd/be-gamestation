import { Request, Response } from "express";
import { prisma } from "../database";

/**
 * GET /games
 * Get list game (public endpoint)
 */
export const getGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceType } = req.query;

    const games = await prisma.game.findMany({
      where: deviceType ? { deviceType: deviceType as any } : undefined,
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
    const { name, deviceType } = req.body;

    // Check if game with same name and deviceType already exists
    const existingGame = await prisma.game.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        deviceType,
      },
    });

    if (existingGame) {
      res.status(400).json({
        success: false,
        message: "Game dengan nama dan deviceType yang sama sudah ada",
      });
      return;
    }

    const game = await prisma.game.create({
      data: {
        name,
        deviceType,
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
    const { name, deviceType } = req.body;

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

    // Check if game with same name and deviceType already exists (excluding current game)
    if (name && deviceType) {
      const existingGame = await prisma.game.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
          deviceType,
          id: { not: gameId },
        },
      });

      if (existingGame) {
        res.status(400).json({
          success: false,
          message: "Game dengan nama dan deviceType yang sama sudah ada",
        });
        return;
      }
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        ...(name && { name }),
        ...(deviceType && { deviceType }),
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
