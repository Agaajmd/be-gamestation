"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMaximumDuration = calculateMaximumDuration;
function calculateMaximumDuration(bookingDate, startHour, startMinute, closeTime) {
    const bookingDateObj = new Date(bookingDate);
    const startDateTime = new Date(bookingDateObj);
    startDateTime.setUTCHours(startHour, startMinute, 0, 0);
    const closeDateTime = new Date(bookingDateObj);
    if (closeTime) {
        const closeDate = new Date(closeTime);
        const closeHour = closeDate.getUTCHours();
        const closeMinute = closeDate.getUTCMinutes();
        closeDateTime.setUTCHours(closeHour, closeMinute, 0, 0);
    }
    else {
        closeDateTime.setUTCHours(23, 59, 59, 0);
    }
    const maxDurationMs = closeDateTime.getTime() - startDateTime.getTime();
    const maxDurationMinutes = Math.floor(maxDurationMs / (1000 * 60));
    return maxDurationMinutes;
}
//# sourceMappingURL=calculateMaximumDuration.js.map