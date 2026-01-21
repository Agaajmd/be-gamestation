import { prisma } from "../database";

export const GameAvailabilityQuery = {
  async getAddedGamesToDevice(roomAndDeviceId: bigint, gameIds: bigint[]) {
    const result = await prisma.gameAvailability.findMany({
      where: {
        roomAndDeviceId,
        gameId: {
          in: gameIds,
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
    return result;
  },
};
