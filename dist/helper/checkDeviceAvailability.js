"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDeviceAvailability = void 0;
const isUnavailableAtTime_1 = require("./isUnavailableAtTime");
const hasConflictingBooking_1 = require("./hasConflictingBooking");
const checkDeviceAvailability = (device, targetStart, targetEnd) => {
    if ((0, isUnavailableAtTime_1.isUnavailableAtTime)(device.availabilityExceptions, targetStart)) {
        return {
            isAvailable: false,
            unavailableReason: "Under maintenance",
        };
    }
    if ((0, hasConflictingBooking_1.hasConflictingBooking)(device.orderItems, targetStart, targetEnd)) {
        return {
            isAvailable: false,
            unavailableReason: "Already booked",
        };
    }
    return {
        isAvailable: true,
        unavailableReason: null,
    };
};
exports.checkDeviceAvailability = checkDeviceAvailability;
//# sourceMappingURL=checkDeviceAvailability.js.map