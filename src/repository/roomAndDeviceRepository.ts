// import { Prisma } from "@prisma/client";
import { prisma } from "../database";

export const RoomAndDeviceRepository = {
  // Find Available Rooms And Devices by Branch ID
  findAvailableByBranchId(branchId: bigint) {
    return prisma.roomAndDevice.findMany({
      where: {
        branchId,
        status: "available",
      },
      select: {
        id: true,
      },
    });
  },

  // Find Room And Device by Branch ID with Orders and Availability Exceptions for a specific date
  findByBranchIdWithOrdersAndExceptions(
    branchId: bigint,
    targetDate: Date,
    branchOpenTime: number,
    branchCloseTime: number
  ) {
    return prisma.roomAndDevice.findMany({
      where: {
        branchId,
        status: "available",
      },
      include: {
        orderItems: {
          where: {
            order: {
              status: { in: ["pending", "paid", "checked_in"] },
            },
            bookingStart: {
              gte: new Date(targetDate.setHours(branchOpenTime, 0, 0, 0)),
              lte: new Date(targetDate.setHours(branchCloseTime, 0, 0, 0)),
            },
          },
        },
        availabilityExceptions: {
          where: {
            startAt: {
              lte: new Date(targetDate.setHours(branchCloseTime, 0, 0, 0)),
            },
            endAt: {
              gte: new Date(targetDate.setHours(branchOpenTime, 0, 0, 0)),
            },
          },
        },
      },
    });
  },

  /* Find Room And Device by branch ID
  */
  findRoomsAndDevicesByBranchId(branchId: bigint) {
    return prisma.roomAndDevice.findMany({
      where: {
        branchId,
      },
    });
  },

  // Find Many
  findManyRoomsAndDevices(where: object, options: object) {
    return prisma.roomAndDevice.findMany({
      where,
      ...options,
    });
  }
};
