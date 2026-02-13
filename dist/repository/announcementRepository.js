"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementRepository = void 0;
const database_1 = require("../database");
exports.AnnouncementRepository = {
    // Find unique announcement
    findUnique(where) {
        return database_1.prisma.announcement.findUnique({
            where,
        });
    },
    // Find announcement by ID
    findById(id) {
        return database_1.prisma.announcement.findUnique({
            where: { id },
        });
    },
    // Find first announcement matching criteria
    findFirst(where, options) {
        return database_1.prisma.announcement.findFirst({
            where,
            ...options,
        });
    },
    // Find multiple announcements with pagination
    findMany(where, skip, take, orderBy) {
        return database_1.prisma.announcement.findMany({
            where,
            skip,
            take,
            orderBy: orderBy || {
                startDate: "desc",
            },
        });
    },
    // Count announcements
    count(where) {
        return database_1.prisma.announcement.count({ where });
    },
    // Create announcement
    create(data) {
        return database_1.prisma.announcement.create({
            data,
        });
    },
    // Update announcement
    update(id, data) {
        return database_1.prisma.announcement.update({
            where: { id },
            data,
        });
    },
    // Delete announcement
    delete(id) {
        return database_1.prisma.announcement.delete({
            where: { id },
        });
    },
    // Find all active announcements (for public display)
    findActive(branchId, skip, take) {
        const now = new Date();
        const where = {
            startDate: { lte: now },
            endDate: { gte: now },
        };
        if (branchId) {
            where.OR = [
                { forBranch: branchId },
                { forBranch: null }, // Global announcements
            ];
        }
        return database_1.prisma.announcement.findMany({
            where,
            skip,
            take,
            orderBy: {
                startDate: "desc",
            },
        });
    },
};
//# sourceMappingURL=announcementRepository.js.map