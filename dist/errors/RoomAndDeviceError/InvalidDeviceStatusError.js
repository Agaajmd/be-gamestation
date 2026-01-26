"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidDeviceStatusError = void 0;
class InvalidDeviceStatusError extends Error {
    constructor(message = "Status device tidak valid") {
        super(message);
        this.name = "InvalidDeviceStatusError";
    }
}
exports.InvalidDeviceStatusError = InvalidDeviceStatusError;
//# sourceMappingURL=InvalidDeviceStatusError.js.map