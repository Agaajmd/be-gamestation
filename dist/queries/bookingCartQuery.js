"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingCartQuery = void 0;
const client_1 = require("@prisma/client");
const bookingCart_1 = require("../promise/bookingCart");
const orderRepository_1 = require("../repository/orderRepository");
exports.BookingCartQuery = {
    async findBookingCartByUserId(userId) {
        const result = await orderRepository_1.OrderRepository.findFirst({ customerId: userId, status: client_1.OrderStatus.cart }, bookingCart_1.bookingCartConfig);
        return result;
    },
};
//# sourceMappingURL=bookingCartQuery.js.map