"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDeviceException = void 0;
/**
 * Check if device has exception on specific date
 */
const hasDeviceException = (deviceId, date, exceptions) => {
    const dayEnd = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    return exceptions.some((exc) => {
        if (exc.roomAndDeviceId !== deviceId)
            return false;
        const excStart = new Date(exc.startAt);
        const excEnd = new Date(exc.endAt);
        return excStart <= date && excEnd >= dayEnd;
    });
};
exports.hasDeviceException = hasDeviceException;
//# sourceMappingURL=hasDeviceException.js.map