"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchPaymentMethodRepository = void 0;
const database_1 = require("../database");
exports.BranchPaymentMethodRepository = {
    // Find First
    findFirst(where, options) {
        return database_1.prisma.branchPaymentMethod.findFirst({
            where,
            ...options,
        });
    },
    // Find by ID
    findById(id) {
        return database_1.prisma.branchPaymentMethod.findUnique({
            where: { id },
            include: {
                branch: true,
            },
        });
    },
    // Find all by branch ID
    findByBranchId(branchId) {
        return database_1.prisma.branchPaymentMethod.findMany({
            where: { branchId },
            include: {
                branch: true,
            },
        });
    },
    // Find active payment methods by branch ID
    findActiveByBranchId(branchId) {
        return database_1.prisma.branchPaymentMethod.findMany({
            where: {
                branchId,
                isActive: true,
            },
        });
    },
    // Find by branch ID and provider
    findByBranchIdAndProvider(branchId, provider) {
        return database_1.prisma.branchPaymentMethod.findFirst({
            where: {
                branchId,
                provider,
            },
        });
    },
    // Find all
    findAll() {
        return database_1.prisma.branchPaymentMethod.findMany({
            include: {
                branch: true,
            },
            orderBy: { branchId: "asc" },
        });
    },
    // Create new payment method
    create(data) {
        return database_1.prisma.branchPaymentMethod.create({
            data: {
                branchId: data.branchId,
                method: data.method,
                provider: data.provider,
                isActive: data.isActive ?? true,
                accountNumber: data.accountNumber,
                accountName: data.accountName,
                qrCodeImage: data.qrCodeImage,
                instructions: data.instructions,
            },
            include: {
                branch: true,
            },
        });
    },
    // Update payment method
    update(id, data) {
        return database_1.prisma.branchPaymentMethod.update({
            where: { id },
            data,
            include: {
                branch: true,
            },
        });
    },
    // Delete payment method
    delete(id) {
        return database_1.prisma.branchPaymentMethod.delete({
            where: { id },
        });
    },
    // Check if payment method exists
    exists(id) {
        return database_1.prisma.branchPaymentMethod.findUnique({
            where: { id },
            select: { id: true },
        });
    },
};
//# sourceMappingURL=branchPaymentMethodRepository.js.map