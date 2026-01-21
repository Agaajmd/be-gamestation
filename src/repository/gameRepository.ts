import { prisma } from "../database";
import { DeviceType } from "@prisma/client";

export const GameRepository = {
  // Find many games with optional deviceType filter
  findMany(deviceType?: DeviceType) {
    return prisma.game.findMany({
      where: deviceType ? { deviceType: deviceType } : undefined,
      orderBy: {
        name: "asc",
      },
    });
  },

  // Find game by ID
  findById(gameId: bigint) {
    return prisma.game.findUnique({
      where: { id: gameId },
    });
  },

  // Find game by name and deviceType
  findByNameAndDeviceType(name: string, deviceType: DeviceType) {
    return prisma.game.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        deviceType: deviceType as DeviceType,
      },
    });
  },

  // Find game by name and deviceType excluding specific ID
  findByNameAndDeviceTypeExcluding(
    name: string,
    deviceType: DeviceType,
    excludeId: bigint,
  ) {
    return prisma.game.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        deviceType: deviceType as DeviceType,
        id: { not: excludeId },
      },
    });
  },

  // Verify if game exists by ID
  exists(gameIds: bigint[]) {
    return prisma.game.findMany({
      where: {
        id: {
          in: gameIds,
        },
      },
      select: { id: true, name: true, deviceType: true },
    });
  },

  // Create new game
  create(data: { name: string; deviceType: DeviceType }) {
    return prisma.game.create({
      data: {
        name: data.name,
        deviceType: data.deviceType as DeviceType,
      },
    });
  },

  // Update game
  update(gameId: bigint, data: { name?: string; deviceType?: DeviceType }) {
    return prisma.game.update({
      where: { id: gameId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.deviceType && { deviceType: data.deviceType }),
      },
    });
  },

  // Delete game
  delete(gameId: bigint) {
    return prisma.game.delete({
      where: { id: gameId },
    });
  },
};
