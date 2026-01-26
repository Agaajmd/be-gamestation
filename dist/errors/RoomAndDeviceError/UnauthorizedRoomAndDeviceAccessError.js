"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedRoomAndDeviceAccessError = void 0;
class UnauthorizedRoomAndDeviceAccessError extends Error {
    constructor(message = "Akses ke room dan device ini tidak diizinkan") {
        super(message);
        this.name = "UnauthorizedRoomAndDeviceAccessError";
    }
}
exports.UnauthorizedRoomAndDeviceAccessError = UnauthorizedRoomAndDeviceAccessError;
//# sourceMappingURL=UnauthorizedRoomAndDeviceAccessError.js.map