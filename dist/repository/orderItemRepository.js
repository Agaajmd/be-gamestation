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
    create(data) {
        return database_1.prisma.orderItem.create({
            data,
        });
    }
};
//# sourceMappingURL=orderItemRepository.js.map