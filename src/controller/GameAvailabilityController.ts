import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { checkBranchAccess } from "../helper/checkBranchAccessHelper";

/**
 * POST /branches/:branchId/rooms-and-devices/:roomAndDeviceId/games
 * Menambahkan 1 atau lebih game ke device
 */
export const addGamesToDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
    const userId = BigInt(req.user!.userId);
    const { gameIds } = req.body;

    // Convert to array if single gameId
    const gameIdsArray = Array.isArray(gameIds) ? gameIds : [gameIds];

    // Cek authorization
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke cabang ini",
      });
      return;
    }

    // Verify device exists and belongs to branch
    const device = await prisma.roomAndDevice.findUnique({
      where: { id: roomAndDeviceId },
      select: {
        id: true,
        branchId: true,
        name: true,
        roomNumber: true,
        deviceType: true,
      },
    });

    if (!device || device.branchId !== branchId) {
      res.status(404).json({
        success: false,
        message: "Device tidak ditemukan di cabang ini",
      });
      return;
    }

    // Verify all games exist
    const games = await prisma.game.findMany({
      where: {
        id: {
          in: gameIdsArray.map((id) => BigInt(id)),
        },
      },
    });

    if (games.length !== gameIdsArray.length) {
      res.status(404).json({
        success: false,
        message: "Beberapa game tidak ditemukan",
      });
      return;
    }

    // Validate DeviceType compatibility
    const incompatibleGames = games.filter(
      (game) => game.deviceType !== device.deviceType
    );

    if (incompatibleGames.length > 0) {
      res.status(400).json({
        success: false,
        message: `DeviceType tidak kompatibel dengan device type ${device.deviceType}`,
        data: {
          deviceType: device.deviceType,
          incompatibleGames: incompatibleGames.map((g) => ({
            id: g.id.toString(),
            name: g.name,
            deviceType: g.deviceType,
          })),
        },
      });
      return;
    }

    // Create game availabilities (skip duplicates)
    const data = gameIdsArray.map((gameId) => ({
      gameId: BigInt(gameId),
      roomAndDeviceId: roomAndDeviceId,
    }));

    const result = await prisma.gameAvailability.createMany({
      data,
      skipDuplicates: true,
    });

    // Get created games for response
    const createdGames = await prisma.gameAvailability.findMany({
      where: {
        roomAndDeviceId: roomAndDeviceId,
        gameId: {
          in: gameIdsArray.map((id) => BigInt(id)),
        },
      },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            deviceType: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: `${result.count} game berhasil ditambahkan ke device`,
      data: {
        deviceId: device.id.toString(),
        deviceName: device.name,
        roomNumber: device.roomNumber,
        addedCount: result.count,
        totalRequested: gameIdsArray.length,
        skippedCount: gameIdsArray.length - result.count,
        games: createdGames.map((ga) => ({
          id: ga.id.toString(),
          gameId: ga.game.id.toString(),
          name: ga.game.name,
          deviceType: ga.game.deviceType,
        })),
      },
    });
  } catch (error) {
    console.error("Add games to device error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan game ke device",
    });
  }
};

/**
 * DELETE /branches/:branchId/rooms-and-devices/:roomAndDeviceId/games
 * Menghapus 1 atau lebih game dari device
 */
export const removeGamesFromDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
    const userId = BigInt(req.user!.userId);
    const { gameIds } = req.body;

    // Convert to array if single gameId
    const gameIdsArray = Array.isArray(gameIds) ? gameIds : [gameIds];

    // Cek authorization
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke cabang ini",
      });
      return;
    }

    // Verify device exists and belongs to branch
    const device = await prisma.roomAndDevice.findUnique({
      where: { id: roomAndDeviceId },
      select: {
        id: true,
        branchId: true,
        name: true,
        roomNumber: true,
      },
    });

    if (!device || device.branchId !== branchId) {
      res.status(404).json({
        success: false,
        message: "Device tidak ditemukan di cabang ini",
      });
      return;
    }

    // Delete game availabilities
    const result = await prisma.gameAvailability.deleteMany({
      where: {
        roomAndDeviceId: roomAndDeviceId,
        gameId: {
          in: gameIdsArray.map((id) => BigInt(id)),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `${result.count} game berhasil dihapus dari device`,
      data: {
        deviceId: device.id.toString(),
        deviceName: device.name,
        roomNumber: device.roomNumber,
        deletedCount: result.count,
        totalRequested: gameIdsArray.length,
      },
    });
  } catch (error) {
    console.error("Remove games from device error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus game dari device",
    });
  }
};
