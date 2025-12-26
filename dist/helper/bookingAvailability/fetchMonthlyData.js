"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMonthlyData = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
/**
 * Fetch all bookings and exceptions for a month
 */
const fetchMonthlyData = async (branchId, deviceIds, startDate, endDate) => {
    const endDatePlusOne = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
    return await Promise.all([
        prisma_1.default.order.findMany({
            where: {
                branchId,
                status: { in: ["pending", "paid", "checked_in"] },
                bookingStart: { gte: startDate, lte: endDatePlusOne },
            },
            select: {
                bookingStart: true,
                bookingEnd: true,
                orderItems: {
                    select: {
                        roomAndDeviceId: true,
                    },
                },
            },
        }),
        prisma_1.default.availabilityException.findMany({
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
    ]);
};
exports.fetchMonthlyData = fetchMonthlyData;
//# sourceMappingURL=fetchMonthlyData.js.map