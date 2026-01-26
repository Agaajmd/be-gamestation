"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMaximumDuration = calculateMaximumDuration;
function calculateMaximumDuration(bookingDate, startHour, startMinute, closeHour) {
    const bookingDateObj = new Date(bookingDate);
    const startDateTime = new Date(bookingDateObj);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    const closeDateTime = new Date(bookingDateObj);
    closeDateTime.setHours(closeHour, 0, 0, 0);
    const maxDurationMs = closeDateTime.getTime() - startDateTime.getTime();
    const maxDurationMinutes = Math.floor(maxDurationMs / (1000 * 60));
    return maxDurationMinutes;
}
//# sourceMappingURL=calculateMaximumDuration.js.map