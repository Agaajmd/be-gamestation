"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingCartConfig = void 0;
exports.bookingCartConfig = {
    include: {
        customer: {
            select: {
                fullname: true,
                email: true,
                phone: true,
            },
        },
        branch: {
            select: {
                name: true,
            },
        },
        orderItems: {
            include: {
                roomAndDevice: {
                    select: {
                        roomNumber: true,
                        deviceType: true,
                        version: true,
                    },
                },
            },
        },
    },
};
//# sourceMappingURL=bookingCart.js.map