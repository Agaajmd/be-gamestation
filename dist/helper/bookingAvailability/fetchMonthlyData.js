"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMonthlyData = void 0;
const database_1 = require("../../database");
/**
 * Fetch all bookings and exceptions for a month
 */
const fetchMonthlyData = async (branchId, deviceIds, startDate, endDate) => {
    const endDatePlusOne = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
    return await Promise.all([
        database_1.prisma.order.findMany({
            where: {
                branchId,
                status: { in: ["pending", "confirmed"] },
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
        database_1.prisma.availabilityException.findMany({
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
        database_1.prisma.branchHoliday.findMany({
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
exports.fetchMonthlyData = fetchMonthlyData;
//# sourceMappingURL=fetchMonthlyData.js.map