import { prisma } from "../database";

export const GameAvailabilityRepository = {
  // Find game availability by ID
  findById(id: bigint) {
    return prisma.gameAvailability.findUnique({
      where: { id },
    });
  },

  // Find many game availabilities for a device
  findByRoomAndDeviceId(roomAndDeviceId: bigint) {
    return prisma.gameAvailability.findMany({
      where: { roomAndDeviceId },
      include: {
        game: true,
      },
    });
  },

  // Create many game availabilities
  createMany(data: Array<{ gameId: bigint; roomAndDeviceId: bigint }>) {
    return prisma.gameAvailability.createMany({
      data,
      skipDuplicates: true,
    });
  },

  // Delete many game availabilities
  deleteMany(roomAndDeviceId: bigint, gameIds: bigint[]) {
    return prisma.gameAvailability.deleteMany({
      where: {
        roomAndDeviceId,
        gameId: {
          in: gameIds,
        },
      },
    });
  },
};
