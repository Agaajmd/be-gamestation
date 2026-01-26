"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateClosed = void 0;
/**
 * Check if all devices are closed (have full-day exceptions) on a date
 */
const isDateClosed = (currentDate, openHour, closeHour, exceptions, holidayDates, totalDevices) => {
    // Check if the date is a holiday
    const dateStr = currentDate.toISOString().split("T")[0];
    if (holidayDates.has(dateStr)) {
        return true;
    }
    // Check if all devices have full-day exceptions
    const dayStart = new Date(currentDate);
    dayStart.setHours(openHour, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(closeHour, 0, 0, 0);
    const fullDayExceptions = exceptions.filter((exc) => {
        const excStart = new Date(exc.startAt);
        const excEnd = new Date(exc.endAt);
        return excStart <= dayStart && excEnd >= dayEnd;
    });
    return fullDayExceptions.length === totalDevices;
};
exports.isDateClosed = isDateClosed;
//# sourceMappingURL=isDateClosed.js.map