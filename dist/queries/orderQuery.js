"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderQuery = void 0;
const orderItemRepository_1 = require("../repository/orderItemRepository");
const client_1 = require("@prisma/client");
exports.OrderQuery = {
    async findDuplicateOrder(roomAndDeviceId, branchId, customerId, bookingStart, bookingEnd) {
        return orderItemRepository_1.OrderItemRepository.findFirst({
            roomAndDeviceId,
            order: {
                branchId,
                customerId,
                status: {
                    in: [client_1.OrderStatus.pending, client_1.OrderStatus.confirmed, client_1.OrderStatus.cart],
                },
            },
            OR: [
                {
                    AND: [
                        { bookingStart: { lte: bookingStart } },
                        { bookingEnd: { gt: bookingStart } },
                    ],
                },
                {
                    AND: [
                        { bookingStart: { lt: bookingEnd } },
                        { bookingEnd: { gte: bookingEnd } },
                    ],
                },
                {
                    AND: [
                        { bookingStart: { gte: bookingStart } },
                        { bookingEnd: { lte: bookingEnd } },
                    ],
                },
            ],
        });
    },
};
//# sourceMappingURL=orderQuery.js.map