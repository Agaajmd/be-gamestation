// Repository
import { GameRepository } from "../../repository/gameRepository";

// Types
interface CreateGamePayload {
  name: string;
  deviceType: DeviceType;
}

interface UpdateGamePayload {
  gameId: bigint;
  name?: string;
  deviceType?: DeviceType;
}

import { DeviceType } from "@prisma/client";

// Errors
import {
  GameNotFoundError,
  GameAlreadyExistsError,
} from "../../errors/GameError/gameError";

// Service function to get all games
export async function getGamesService(deviceType?: DeviceType) {
  const games = await GameRepository.findMany(deviceType);
  return games;
}

// Service function to get game by ID
export async function getGameByIdService(gameId: bigint) {
  const game = await GameRepository.findById(gameId);
  if (!game) {
    throw new GameNotFoundError();
  }
  return game;
}

// Service function to create a new game
export async function createGameService(payload: CreateGamePayload) {
  const { name, deviceType } = payload;

  // Check if game with same name and deviceType already exists
  const existingGame = await GameRepository.findByNameAndDeviceType(
    name,
    deviceType as DeviceType,
  );

  if (existingGame) {
    throw new GameAlreadyExistsError();
  }

  const game = await GameRepository.create({
    name,
    deviceType: deviceType as DeviceType,
  });

  return game;
}

// Service function to update a game
export async function updateGameService(payload: UpdateGamePayload) {
  const { gameId, name, deviceType } = payload;

  // Check if game exists
  const game = await GameRepository.findById(gameId);
  if (!game) {
    throw new GameNotFoundError();
  }

  // Check if game with same name and deviceType already exists (excluding current game)
  if (name && deviceType) {
    const existingGame = await GameRepository.findByNameAndDeviceTypeExcluding(
      name,
      deviceType,
      gameId,
    );

    if (existingGame) {
      throw new GameAlreadyExistsError();
    }
  }

  const updatedGame = await GameRepository.update(gameId, {
    name,
    deviceType,
  });

  return updatedGame;
}

// Service function to delete a game
export async function deleteGameService(gameId: bigint) {
  // Check if game exists
  const game = await GameRepository.findById(gameId);
  if (!game) {
    throw new Error("Game tidak ditemukan");
  }

  await GameRepository.delete(gameId);
  return game;
}
