import { prisma } from "../../database";

/**
 * Fetch all bookings and exceptions for a month
 */
export const fetchMonthlyData = async (
  branchId: bigint,
  deviceIds: bigint[],
  startDate: Date,
  endDate: Date
) => {
  const endDatePlusOne = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);

  return await Promise.all([
    prisma.order.findMany({
      where: {
        branchId,
        status: { in: ["pending", "paid", "checked_in"] },
        orderItems: {
          some: {
            bookingStart: { gte: startDate, lte: endDatePlusOne },
          },
        },
      },
      select: {
        orderItems: {
          select: {
            bookingStart: true,
            bookingEnd: true,
            roomAndDeviceId: true,
          },
        },
      },
    }),
    prisma.availabilityException.findMany({
      where: {
        roomAndDeviceId: { in: deviceIds },
        startAt: { gte: startDate, lte: endDatePlusOne },
      },
      select: {
        roomAndDeviceId: true,
        startAt: true,
        endAt: true,
        reason: true,
      },
    }),
    prisma.branchHoliday.findMany({
      where: {
        branchId,
        date: { gte: startDate, lte: endDatePlusOne },
      },
      select: {
        branchId: true,
        date: true,
        name: true,
        description: true,
      },
    }),
  ]);
};
