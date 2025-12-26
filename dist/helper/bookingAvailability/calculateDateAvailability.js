"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDateAvailability = void 0;
const hasDeviceException_1 = require("./hasDeviceException");
const getDeviceOrdersForDate_1 = require("./getDeviceOrdersForDate");
const calculatedBookedHours_1 = require("./calculatedBookedHours");
/**
 * Calculate availability for a single date
 */
const calculateDateAvailability = (currentDate, devices, orders, exceptions, totalOperatingHours, openHour, closeHour) => {
    let availableDevices = 0;
    let bookedDevices = 0;
    for (const device of devices) {
        // Skip device with exception
        if ((0, hasDeviceException_1.hasDeviceException)(device.id, currentDate, exceptions)) {
            continue;
        }
        // Get orders for this device on this date
        const deviceOrders = (0, getDeviceOrdersForDate_1.getDeviceOrdersForDate)(device.id, currentDate, orders);
        // Calculate booked hours
        const bookedHours = (0, calculatedBookedHours_1.calculateBookedHours)(deviceOrders, currentDate, openHour, closeHour);
        const availableHours = totalOperatingHours - bookedHours;
        if (availableHours > 0) {
            availableDevices++;
        }
        else if (bookedHours > 0) {
            bookedDevices++;
        }
    }
    return { availableDevices, bookedDevices };
};
exports.calculateDateAvailability = calculateDateAvailability;
//# sourceMappingURL=calculateDateAvailability.js.map