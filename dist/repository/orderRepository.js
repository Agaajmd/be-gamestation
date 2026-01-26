"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const database_1 = require("../database");
const orderInclude = {
    orderItems: {
        include: {
            roomAndDevice: {
                include: {
                    category: true,
                },
            },
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
    customer: {
        select: {
            id: true,
            email: true,
            fullname: true,
            phone: true,
        },
    },
    payment: true,
    session: true,
};
exports.OrderRepository = {
    // Find Unique
    findUnique(where) {
        return database_1.prisma.order.findUnique({
            where: where,
            include: orderInclude,
        });
    },
    // Find order by ID
    findById(orderId) {
        return database_1.prisma.order.findUnique({
            where: { id: orderId },
            include: orderInclude,
        });
    },
    // Find order by order code
    findByOrderCode(orderCode) {
        return database_1.prisma.order.findUnique({
            where: { orderCode },
            include: orderInclude,
        });
    },
    // Find first order by custom where
    findFirst(where, options) {
        return database_1.prisma.order.findFirst({
            where,
            include: orderInclude,
            ...options,
        });
    },
    // Find multiple orders with pagination
    findMany(where, skip, take) {
        return database_1.prisma.order.findMany({
            where,
            include: orderInclude,
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    // Find orders by customer ID
    findByCustomerId(customerId, skip, take) {
        return database_1.prisma.order.findMany({
            where: { customerId },
            include: orderInclude,
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    // Find orders by branch ID (for admin/owner)
    findByBranchId(branchId, skip, take) {
        return database_1.prisma.order.findMany({
            where: { branchId },
            include: orderInclude,
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    // Count orders
    count(where) {
        return database_1.prisma.order.count({ where });
    },
    // Create order with items
    create(data) {
        return database_1.prisma.order.create({
            data,
            include: orderInclude,
        });
    },
    // Update order
    update(orderId, data) {
        return database_1.prisma.order.update({
            where: { id: orderId },
            data,
            include: orderInclude,
        });
    },
    // Update order status
    updateStatus(orderId, status, paymentStatus) {
        return database_1.prisma.order.update({
            where: { id: orderId },
            data: { status, ...(paymentStatus && { paymentStatus }) },
            include: orderInclude,
        });
    },
    // Delete order
    delete(orderId) {
        return database_1.prisma.order.delete({
            where: { id: orderId },
        });
    },
    // Find first order matching criteria
    async findFirstSimple(where) {
        return database_1.prisma.order.findFirst({ where });
    },
    // Get cart order for customer
    getCartOrder(customerId, branchId) {
        const where = {
            customerId,
            status: "cart",
        };
        if (branchId) {
            where.branchId = branchId;
        }
        return database_1.prisma.order.findFirst({
            where,
            include: orderInclude,
        });
    },
};
//# sourceMappingURL=orderRepository.js.map