"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBookedHours = void 0;
/**
 * Calculate booked hours for a device on a specific date
 */
const calculateBookedHours = (orders, date, openHour, closeHour) => {
    let bookedHours = 0;
    orders.forEach((order) => {
        const start = new Date(Math.max(order.bookingStart.getTime(), new Date(date).setHours(openHour, 0, 0, 0)));
        const end = new Date(Math.min(order.bookingEnd.getTime(), new Date(date).setHours(closeHour, 0, 0, 0)));
        bookedHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    });
    return bookedHours;
};
exports.calculateBookedHours = calculateBookedHours;
//# sourceMappingURL=calculatedBookedHours.js.map