"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPastDate = void 0;
/**
 * Check if date is in the past
 */
const isPastDate = (date) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dateStr = date.toISOString().split('T')[0];
    return dateStr < todayStr;
};
exports.isPastDate = isPastDate;
//# sourceMappingURL=isPastDate.js.map