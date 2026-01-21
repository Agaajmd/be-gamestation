import { Request, Response } from "express";

// Services
import {
  addGamesToDeviceService,
  removeGamesFromDeviceService,
} from "../service/GameAvailabilityService/gameAvailabilityService";

// Error
import { handleError } from "../helper/responseHelper";

/**
 * POST /branches/:branchId/rooms-and-devices/:roomAndDeviceId/games
 * Menambahkan 1 atau lebih game ke device
 */
export const addGamesToDevice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
    const userId = BigInt(req.user!.userId);
    const { gameIds } = req.body;

    // Convert to array if single gameId
    const gameIdsArray = Array.isArray(gameIds) ? gameIds : [gameIds];

    const result = await addGamesToDeviceService({
      branchId,
      roomAndDeviceId,
      userId,
      gameIds: gameIdsArray.map((id: string | number) => BigInt(id)),
    });

    res.status(201).json({
      success: true,
      message: `${result.addedCount} game berhasil ditambahkan ke device`,
      data: result,
    });
  } catch (error: any) {
    handleError(error, res);
  }
};

/**
 * DELETE /branches/:branchId/rooms-and-devices/:roomAndDeviceId/games
 * Menghapus 1 atau lebih game dari device
 */
export const removeGamesFromDevice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
    const userId = BigInt(req.user!.userId);
    const { gameIds } = req.body;

    // Convert to array if single gameId
    const gameIdsArray = Array.isArray(gameIds) ? gameIds : [gameIds];

    const result = await removeGamesFromDeviceService({
      branchId,
      roomAndDeviceId,
      userId,
      gameIds: gameIdsArray.map((id: string | number) => BigInt(id)),
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} game berhasil dihapus dari device`,
      data: result,
    });
  } catch (error) {
    handleError(error, res);
  }
};
