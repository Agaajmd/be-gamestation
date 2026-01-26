"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPastTime = void 0;
/**
 * Check if time is in the past
 */
const isPastTime = (bookingStart, bookingDate) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = bookingDate.getTime() === today.getTime();
    return isToday && bookingStart <= now;
};
exports.isPastTime = isPastTime;
//# sourceMappingURL=isPastTime.js.map