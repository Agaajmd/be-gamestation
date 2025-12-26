"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBranchOperatingHours = void 0;
/**
 * Get branch operating hours
 */
const getBranchOperatingHours = (openTime, closeTime) => {
    const openHour = openTime ? new Date(openTime).getUTCHours() : 9;
    const closeHour = closeTime ? new Date(closeTime).getUTCHours() : 23;
    return { openHour, closeHour, totalHours: closeHour - openHour };
};
exports.getBranchOperatingHours = getBranchOperatingHours;
//# sourceMappingURL=getBranchOperatingHours.js.map