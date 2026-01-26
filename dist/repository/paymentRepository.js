"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const database_1 = require("../database");
const paymentInclude = {
    order: {
        include: {
            customer: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phone: true,
                },
            },
            branch: {
                select: {
                    id: true,
                    name: true,
                    address: true,
                    phone: true,
                },
            },
            orderItems: {
                include: {
                    roomAndDevice: true,
                },
            },
        },
    },
};
exports.PaymentRepository = {
    // Find payment by ID
    findById(paymentId) {
        return database_1.prisma.payment.findUnique({
            where: { id: paymentId },
            include: paymentInclude,
        });
    },
    // Find payment by order ID
    findByOrderId(orderId) {
        return database_1.prisma.payment.findUnique({
            where: { orderId },
            include: paymentInclude,
        });
    },
    // Find many payments with filters
    findMany(where, skip, take) {
        return database_1.prisma.payment.findMany({
            where,
            include: paymentInclude,
            skip,
            take,
            orderBy: { id: "desc" },
        });
    },
    // Count payments
    count(where) {
        return database_1.prisma.payment.count({ where });
    },
    // Find first matching criteria
    findFirst(where) {
        return database_1.prisma.payment.findFirst({
            where,
            include: paymentInclude,
        });
    },
    // Create payment
    create(data) {
        return database_1.prisma.payment.create({
            data,
            include: paymentInclude,
        });
    },
    // Update payment
    update(paymentId, data) {
        return database_1.prisma.payment.update({
            where: { id: paymentId },
            data,
            include: paymentInclude,
        });
    },
    // Update status
    updateStatus(paymentId, status) {
        return database_1.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: status,
                ...(status === "paid" && { paidAt: new Date() }),
            },
            include: paymentInclude,
        });
    },
    // Delete payment
    delete(paymentId) {
        return database_1.prisma.payment.delete({
            where: { id: paymentId },
        });
    },
};
//# sourceMappingURL=paymentRepository.js.map