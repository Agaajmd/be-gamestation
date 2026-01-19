import { Prisma } from "@prisma/client";

export const bookingCartConfig = {
  include: {
    customer: {
      select: {
        fullname: true,
        email: true,
        phone: true,
      },
    },
    branch: {
      select: {
        name: true,
      },
    },
    orderItems: {
      include: {
        roomAndDevice: {
          select: {
            roomNumber: true,
            deviceType: true,
            version: true,
          },
        },
      },
    },
  },
} satisfies Prisma.OrderFindFirstArgs;

export type BookingCartWithRelations = Prisma.OrderGetPayload<
  typeof bookingCartConfig
>;
