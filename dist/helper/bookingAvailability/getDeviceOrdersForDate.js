"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceOrdersForDate = void 0;
const getDeviceOrdersForDate = (deviceId, date, orders) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    return orders.filter((order) => {
        order.orderItems.filter((item) => {
            if (item.roomAndDeviceId !== deviceId)
                return false;
            const start = new Date(item.bookingStart);
            const end = new Date(item.bookingEnd);
            return start <= dayEnd && end >= dayStart;
        });
    });
};
exports.getDeviceOrdersForDate = getDeviceOrdersForDate;
//# sourceMappingURL=getDeviceOrdersForDate.js.map