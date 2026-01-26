"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBookedHours = void 0;
/**
 * Calculate booked hours for a device on a specific date
 */
const calculateBookedHours = (orders, date, openHour, closeHour) => {
    let bookedHours = 0;
    const dayOpen = new Date(date);
    dayOpen.setHours(openHour, 0, 0, 0);
    const dayClose = new Date(date);
    dayClose.setHours(closeHour, 0, 0, 0);
    orders.forEach((order) => {
        order.orderItems.forEach((item) => {
            const start = new Date(Math.max(item.bookingStart.getTime(), dayOpen.getTime()));
            const end = new Date(Math.min(item.bookingEnd.getTime(), dayClose.getTime()));
            // only count if valid overlap
            if (end > start) {
                bookedHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            }
        });
    });
    return bookedHours;
};
exports.calculateBookedHours = calculateBookedHours;
//# sourceMappingURL=calculatedBookedHours.js.map