"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = void 0;
/**
 * Helper function to format time as HH:MM:SS
 */
const formatTime = (date) => {
    if (!date)
        return null;
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
};
exports.formatTime = formatTime;
//# sourceMappingURL=timeHelper.js.map