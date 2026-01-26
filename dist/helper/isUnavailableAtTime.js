"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnavailableAtTime = void 0;
const isUnavailableAtTime = (exceptions, targetStart) => {
    return exceptions.some((exc) => targetStart >= exc.startAt && targetStart < exc.endAt);
};
exports.isUnavailableAtTime = isUnavailableAtTime;
//# sourceMappingURL=isUnavailableAtTime.js.map