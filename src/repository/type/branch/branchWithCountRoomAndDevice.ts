import { Prisma } from "@prisma/client";

export const branchWithCountRoomAndDeviceConfig = {
  include: {
    _count: {
      select: {
        roomAndDevices: {
          where: {
            status: "available",
          },
        },
      },
    },
  },
} satisfies Prisma.BranchDefaultArgs;

export type BranchWithCountRoomAndDevice = Prisma.BranchGetPayload<
  typeof branchWithCountRoomAndDeviceConfig
>;
