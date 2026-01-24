// import { Prisma } from "@prisma/client";
import { prisma } from "../database";

const roomAndDeviceInclude = {
  category: {
    select: {
      id: true,
      name: true,
      tier: true,
      branchId: true,
    },
  },
  games: {
    select: {
      game: {
        select: {
          id: true,
          name: true,
          deviceType: true,
        },
      },
    },
  },
  orderItems: {
    select: {
      id: true,
      bookingStart: true,
      bookingEnd: true,
    },
  },
  _count: {
    select: {
      orderItems: true,
      sessions: true,
    },
  },
};

export const RoomAndDeviceRepository = {

  // Find First
  findFirst(where: object, options?: object) {
    return prisma.roomAndDevice.findFirst({
      where: where,
      ...options,
    });
  },

  // Find Unique
  findUnique(where: any, options?: object) {
    return prisma.roomAndDevice.findUnique({
      where: where,
      ...options,
    });
  },

  // Find Room And Device by ID
  findById(id: bigint, branchId?: bigint) {
    const where: any = { id };
    if (branchId) {
      where.branchId = branchId;
    }
    return prisma.roomAndDevice.findUnique({
      where,
      include: roomAndDeviceInclude,
    });
  },

  // Find many with filters
  findMany(where: object, skip?: number, take?: number) {
    return prisma.roomAndDevice.findMany({
      where,
      include: roomAndDeviceInclude,
      skip,
      take,
      orderBy: { roomNumber: "asc" },
    });
  },

  // Count
  count(where: object, options?: object) {
    return prisma.roomAndDevice.count({ where, ...options });
  },

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
    branchCloseTime: number,
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
              status: { in: ["pending", "confirmed", "completed"] as any },
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

  // Find Room And Device by branch ID
  findRoomsAndDevicesByBranchId(branchId: bigint) {
    return prisma.roomAndDevice.findMany({
      where: {
        branchId,
      },
    });
  },

  // Find Many with custom options
  findManyRoomsAndDevices(where: object, options: object) {
    return prisma.roomAndDevice.findMany({
      where,
      ...options,
    });
  },

  // Create room and device
  create(data: any) {
    return prisma.roomAndDevice.create({
      data,
      include: roomAndDeviceInclude,
    });
  },

  // Update room and device
  update(id: bigint, data: any) {
    return prisma.roomAndDevice.update({
      where: { id },
      data,
      include: roomAndDeviceInclude,
    });
  },

  // Update status
  updateStatus(id: bigint, status: string) {
    return prisma.roomAndDevice.update({
      where: { id },
      data: { status: status as any },
      include: roomAndDeviceInclude,
    });
  },

  // Delete
  delete(id: bigint) {
    return prisma.roomAndDevice.delete({
      where: { id },
    });
  },
};
