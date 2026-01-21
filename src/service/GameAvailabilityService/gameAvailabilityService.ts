// Repository
import { RoomAndDeviceRepository } from "../../repository/roomAndDeviceRepository";
import { GameRepository } from "../../repository/gameRepository";
import { GameAvailabilityRepository } from "../../repository/gameAvailabilityRepository";

// Helper
import { checkBranchAccess } from "../../helper/checkBranchAccessHelper";

// Queries
import { GameAvailabilityQuery } from "../../queries/gameAvailibilityQuery";

// Errors
import { RoomAndDeviceNotFoundError } from "../../errors/RoomAndDeviceError/roomAndDeviceError";
import {
  InvalidGameDataError,
  IncompatibleDeviceTypeError,
} from "../../errors/GameError/gameError";

// Types
interface AddGamesToDevicePayload {
  branchId: bigint;
  roomAndDeviceId: bigint;
  userId: bigint;
  gameIds: bigint[];
}

interface RemoveGamesFromDevicePayload {
  branchId: bigint;
  roomAndDeviceId: bigint;
  userId: bigint;
  gameIds: bigint[];
}

// Service function to add games to device
export async function addGamesToDeviceService(
  payload: AddGamesToDevicePayload,
) {
  const { branchId, roomAndDeviceId, userId, gameIds } = payload;

  // Check authorization
  const hasAccess = await checkBranchAccess(userId, branchId);
  if (!hasAccess) {
    throw new Error("Anda tidak memiliki akses ke cabang ini");
  }

  // Verify device exists and belongs to branch
  const roomAndDevice = await RoomAndDeviceRepository.findById(
    roomAndDeviceId,
    branchId,
  );

  if (!roomAndDevice) {
    throw new RoomAndDeviceNotFoundError();
  }

  // Verify all games exist
  const games = await GameRepository.exists(gameIds);

  const foundGameIds = games.map((game) => game.id);
  const missingGameIds = gameIds.filter((id) => !foundGameIds.includes(id));

  if (missingGameIds.length > 0) {
    throw new InvalidGameDataError(missingGameIds);
  }

  // Validate DeviceType compatibility
  const incompatibleGames = games.filter(
    (game) => game.deviceType !== roomAndDevice.deviceType,
  );

  if (incompatibleGames.length > 0) {
    throw new IncompatibleDeviceTypeError(
      roomAndDevice.deviceType,
      incompatibleGames,
    );
  }

  // Create game availabilities (skip duplicates)
  const data = gameIds.map((gameId) => ({
    gameId,
    roomAndDeviceId,
  }));

  const result = await GameAvailabilityRepository.createMany(data);

  // Get created games for response
  const createdGames = await GameAvailabilityQuery.getAddedGamesToDevice(
    roomAndDeviceId,
    gameIds,
  );

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
export async function removeGamesFromDeviceService(
  payload: RemoveGamesFromDevicePayload,
) {
  const { branchId, roomAndDeviceId, userId, gameIds } = payload;

  // Check authorization
  const hasAccess = await checkBranchAccess(userId, branchId);
  if (!hasAccess) {
    throw new Error("Anda tidak memiliki akses ke cabang ini");
  }

  // Verify device exists and belongs to branch
  const roomAndDevice = await RoomAndDeviceRepository.findById(
    roomAndDeviceId,
    branchId,
  );

  if (!roomAndDevice) {
    throw new RoomAndDeviceNotFoundError();
  }

  // Delete game availabilities
  const result = await GameAvailabilityRepository.deleteMany(
    roomAndDeviceId,
    gameIds,
  );

  return {
    roomAndDeviceId: roomAndDevice.id.toString(),
    deviceName: roomAndDevice.name,
    roomNumber: roomAndDevice.roomNumber,
    deletedCount: result.count,
    totalRequested: gameIds.length,
  };
}
