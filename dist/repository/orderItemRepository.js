"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemRepository = void 0;
const database_1 = require("../database");
exports.OrderItemRepository = {
    // Find first
    findFirst(where, options) {
        return database_1.prisma.orderItem.findFirst({
            where: where,
            ...options,
        });
    },
    findMany(where, options) {
        return database_1.prisma.orderItem.findMany({
            where: where,
            ...options,
        });
    },
    create(data) {
        return database_1.prisma.orderItem.create({
            data,
        });
    },
    findById(id, options) {
        return database_1.prisma.orderItem.findUnique({
            where: { id },
            ...options,
        });
    },
    delete(id) {
        return database_1.prisma.orderItem.delete({
            where: { id },
        });
    }
};
//# sourceMappingURL=orderItemRepository.js.map