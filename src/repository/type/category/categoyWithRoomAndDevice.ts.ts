import { Prisma } from "@prisma/client";

export const CategoryWithRoomAndDeviceConfig = {
  include: {
    roomAndDevices: {
      where: {
        status: "available",
      },
      select: {
        id: true,
        deviceType: true,
        version: true,
      },
    },
  },
  orderBy: { tier: "asc" },
} satisfies Prisma.CategoryFindManyArgs;

export type CategoryWithRoomAndDevice = Prisma.CategoryGetPayload<
  typeof CategoryWithRoomAndDeviceConfig
>;
