"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasConflictingBooking = void 0;
const BUFFER_MINUTES = 10;
const hasConflictingBooking = (orderItems, targetStart, targetEnd) => {
    return orderItems.some(item => {
        const bookingStart = item.bookingStart;
        const bookingEnd = new Date(item.bookingEnd);
        bookingEnd.setMinutes(bookingEnd.getMinutes() + BUFFER_MINUTES);
        return targetStart < bookingEnd && targetEnd > bookingStart;
    });
};
exports.hasConflictingBooking = hasConflictingBooking;
//# sourceMappingURL=hasConflictingBooking.js.map