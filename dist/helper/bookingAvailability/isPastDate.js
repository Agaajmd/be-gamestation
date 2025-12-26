"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPastDate = void 0;
/**
 * Check if date is in the past
 */
const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
};
exports.isPastDate = isPastDate;
//# sourceMappingURL=isPastDate.js.map