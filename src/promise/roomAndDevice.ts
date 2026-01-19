import { Prisma } from "@prisma/client";

export const RoomAndDeviceConfig = {
  include: {
    category: true,
    orderItems: {
      include: {
        order: {
          select: { status: true },
        },
      },
    },
    availabilityExceptions: true,
  },
  orderBy: { roomNumber: "asc" },
} satisfies Prisma.roomAndDeviceFindManyArgs;

export type RoomAndDeviceWithRelations = Prisma.roomAndDeviceGetPayload<
  typeof RoomAndDeviceConfig
>;
