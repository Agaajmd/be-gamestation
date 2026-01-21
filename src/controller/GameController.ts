import { Request, Response } from "express";

// Services
import {
  getGamesService,
  getGameByIdService,
  createGameService,
  updateGameService,
  deleteGameService,
} from "../service/GameService/gameService";

// Types
import { DeviceType } from "@prisma/client";

// Error
import { handleError } from "../helper/responseHelper";

/**
 * GET /games
 * Get list game (public endpoint)
 */
export const getGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceType } = req.query;

    const games = await getGamesService(deviceType as DeviceType | undefined);

    res.status(200).json({
      success: true,
      data: games,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /games/:id
 * Get game by ID
 */
export const getGameById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const gameId = BigInt(req.params.id);

    const game = await getGameByIdService(gameId);

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * POST /games
 * Create new game (owner/admin only)
 */
export const createGame = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, deviceType } = req.body;

    const game = await createGameService({
      name,
      deviceType: deviceType as DeviceType,
    });

    res.status(201).json({
      success: true,
      message: "Game berhasil ditambahkan",
      data: game,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PUT /games/:id
 * Update game (owner/admin only)
 */
export const updateGame = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const gameId = BigInt(req.params.id);
    const { name, deviceType } = req.body;

    const updatedGame = await updateGameService({
      gameId,
      name,
      deviceType: deviceType as DeviceType,
    });

    res.status(200).json({
      success: true,
      message: "Game berhasil diupdate",
      data: updatedGame,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * DELETE /games/:id
 * Delete game (owner only)
 */
export const deleteGame = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const gameId = BigInt(req.params.id);

    await deleteGameService(gameId);

    res.status(200).json({
      success: true,
      message: "Game berhasil dihapus",
    });
  } catch (error) {
    handleError(error, res);
  }
};
