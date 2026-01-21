import { AppError } from "../appError";

// Types 
import { DeviceType } from "@prisma/client";

export class GameNotFoundError extends AppError {
  constructor() {
    super("Game tidak ditemukan", 404, "GAME_NOT_FOUND");
  }
}

export class GameAlreadyExistsError extends AppError {
  constructor() {
    super(
      "Game dengan nama dan deviceType yang sama sudah ada",
      400,
      "GAME_ALREADY_EXISTS",
    );
  }
}

export class InvalidGameDataError extends AppError {
  constructor(public missingGameIds: bigint[]) {
    super("Beberapa game tidak ditemukan", 400, "INVALID_GAME_DATA", {
      missingGameIds,
    });
  }
}

export class IncompatibleDeviceTypeError extends AppError {
  constructor(
    deviceType: DeviceType,
    incompatibleGames: Array<{
      id: bigint;
      name: string;
      deviceType: DeviceType | null;
    }>,
  ) {
    super(
      `DeviceType tidak kompatibel dengan device type ${deviceType}`,
      400,
      "INCOMPATIBLE_DEVICE_TYPE",
      {
        deviceType,
        incompatibleGames: incompatibleGames.map((g) => ({
          id: g.id.toString(),
          name: g.name,
          deviceType: g.deviceType,
        })),
      },
    );
  }
}
