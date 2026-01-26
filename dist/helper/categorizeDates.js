"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorizeDates = categorizeDates;
const isPastDate_1 = require("./bookingAvailability/isPastDate");
const isDateClosed_1 = require("./bookingAvailability/isDateClosed");
const calculateDateAvailability_1 = require("./bookingAvailability/calculateDateAvailability");
function categorizeDates(startDate, endDate, devices, orders, openHour, closeHour, totalHours, exceptions, holidays) {
    const holidayDates = new Set(holidays.map((date) => date.toISOString().split("T")[0]));
    const availableDates = [];
    const fullyBookedDates = [];
    const closedDates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const currentDate = new Date(d);
        const dateStr = currentDate.toISOString().split("T")[0];
        // Skip past dates
        if ((0, isPastDate_1.isPastDate)(currentDate))
            continue;
        // Check if branch is closed
        if ((0, isDateClosed_1.isDateClosed)(currentDate, openHour, closeHour, exceptions, holidayDates, devices.length)) {
            closedDates.push(dateStr);
            continue;
        }
        // Calculate availability
        const { availableDevices, bookedDevices } = (0, calculateDateAvailability_1.calculateDateAvailability)(currentDate, devices, orders, exceptions, totalHours, openHour, closeHour);
        // Categorize
        if (availableDevices === 0 && bookedDevices > 0) {
            fullyBookedDates.push(dateStr);
        }
        else if (availableDevices > 0) {
            availableDates.push(dateStr);
        }
    }
    return { availableDates, fullyBookedDates, closedDates };
}
//# sourceMappingURL=categorizeDates.js.map