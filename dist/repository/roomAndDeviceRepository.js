"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomAndDeviceRepository = void 0;
// import { Prisma } from "@prisma/client";
const database_1 = require("../database");
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
exports.RoomAndDeviceRepository = {
    // Find First
    findFirst(where, options) {
        return database_1.prisma.roomAndDevice.findFirst({
            where: where,
            ...options,
        });
    },
    // Find Unique
    findUnique(where, options) {
        return database_1.prisma.roomAndDevice.findUnique({
            where: where,
            ...options,
        });
    },
    // Find Room And Device by ID
    findById(id, branchId) {
        const where = { id };
        if (branchId) {
            where.branchId = branchId;
        }
        return database_1.prisma.roomAndDevice.findUnique({
            where,
            include: roomAndDeviceInclude,
        });
    },
    // Find many with filters
    findMany(where, skip, take) {
        return database_1.prisma.roomAndDevice.findMany({
            where,
            include: roomAndDeviceInclude,
            skip,
            take,
            orderBy: { roomNumber: "asc" },
        });
    },
    // Count
    count(where, options) {
        return database_1.prisma.roomAndDevice.count({ where, ...options });
    },
    // Find Available Rooms And Devices by Branch ID
    findAvailableByBranchId(branchId) {
        return database_1.prisma.roomAndDevice.findMany({
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
    findByBranchIdWithOrdersAndExceptions(branchId, targetDate, branchOpenTime, branchCloseTime) {
        return database_1.prisma.roomAndDevice.findMany({
            where: {
                branchId,
                status: "available",
            },
            include: {
                orderItems: {
                    where: {
                        order: {
                            status: { in: ["pending", "confirmed", "completed"] },
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
    findRoomsAndDevicesByBranchId(branchId) {
        return database_1.prisma.roomAndDevice.findMany({
            where: {
                branchId,
            },
        });
    },
    // Find Many with custom options
    findManyRoomsAndDevices(where, options) {
        return database_1.prisma.roomAndDevice.findMany({
            where,
            ...options,
        });
    },
    // Create room and device
    create(data) {
        return database_1.prisma.roomAndDevice.create({
            data,
            include: roomAndDeviceInclude,
        });
    },
    // Update room and device
    update(id, data) {
        return database_1.prisma.roomAndDevice.update({
            where: { id },
            data,
            include: roomAndDeviceInclude,
        });
    },
    // Update status
    updateStatus(id, status) {
        return database_1.prisma.roomAndDevice.update({
            where: { id },
            data: { status: status },
            include: roomAndDeviceInclude,
        });
    },
    // Delete
    delete(id) {
        return database_1.prisma.roomAndDevice.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=roomAndDeviceRepository.js.map