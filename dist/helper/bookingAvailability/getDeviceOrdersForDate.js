"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceOrdersForDate = void 0;
const getDeviceOrdersForDate = (deviceId, date, orders) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    return orders.filter((order) => {
        const hasDevice = order.orderItems.some((item) => item.roomAndDeviceId === deviceId);
        if (!hasDevice)
            return false;
        const orderStart = new Date(order.bookingStart);
        const orderEnd = new Date(order.bookingEnd);
        return orderStart <= dayEnd && orderEnd >= dayStart;
    });
};
exports.getDeviceOrdersForDate = getDeviceOrdersForDate;
//# sourceMappingURL=getDeviceOrdersForDate.js.map