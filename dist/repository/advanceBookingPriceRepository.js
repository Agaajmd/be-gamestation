"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvanceBookingPriceRepository = void 0;
const database_1 = require("../database");
exports.AdvanceBookingPriceRepository = {
    // Find First
    findFirst(where, options) {
        return database_1.prisma.advanceBookingPrice.findFirst({
            where,
            ...options,
        });
    },
    // Find advance booking price by branch ID and days in advance
    findOne(branchId, minDays, maxDays) {
        const where = {
            branchId,
            minDays,
        };
        if (maxDays !== null) {
            where.maxDays = maxDays;
        }
        else {
            where.maxDays = null;
        }
        return database_1.prisma.advanceBookingPrice.findFirst({
            where,
        });
    },
    // Find all advance booking prices by branch ID
    findByBranchId(branchId) {
        return database_1.prisma.advanceBookingPrice.findMany({
            where: { branchId },
        });
    },
    // Find all advance booking prices
    findAll() {
        return database_1.prisma.advanceBookingPrice.findMany();
    },
    // Find advance booking price by ID
    findById(id) {
        return database_1.prisma.advanceBookingPrice.findUnique({
            where: { id },
        });
    },
    // Create a new advance booking price
    create(data) {
        const createData = {
            branchId: data.branchId,
            minDays: data.minDays,
            additionalFee: data.additionalFee,
        };
        if (data.maxDays !== null) {
            createData.maxDays = data.maxDays;
        }
        return database_1.prisma.advanceBookingPrice.create({
            data: createData,
        });
    },
    // Update an advance booking price
    update(id, data) {
        const updateData = {};
        if (data.minDays !== undefined)
            updateData.minDays = data.minDays;
        if (data.additionalFee !== undefined)
            updateData.additionalFee = data.additionalFee;
        if (data.maxDays !== undefined)
            updateData.maxDays = data.maxDays;
        return database_1.prisma.advanceBookingPrice.update({
            where: { id },
            data: updateData,
        });
    },
    // Delete an advance booking price
    delete(id) {
        return database_1.prisma.advanceBookingPrice.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=advanceBookingPriceRepository.js.map