"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceHasOrderItemsError = exports.DeviceHasActiveSessionError = exports.DuplicateRoomAndDeviceError = exports.RoomAndDeviceUnavailableError = exports.RoomAndDeviceNotFoundError = void 0;
const appError_1 = require("../appError");
class RoomAndDeviceNotFoundError extends appError_1.AppError {
    constructor() {
        super("Ruangan dan perangkat tidak ditemukan", 404, "ROOM_AND_DEVICE_NOT_FOUND");
    }
}
exports.RoomAndDeviceNotFoundError = RoomAndDeviceNotFoundError;
class RoomAndDeviceUnavailableError extends appError_1.AppError {
    constructor() {
        super("Ruangan dan perangkat tidak tersedia", 400, "ROOM_AND_DEVICE_UNAVAILABLE");
    }
}
exports.RoomAndDeviceUnavailableError = RoomAndDeviceUnavailableError;
class DuplicateRoomAndDeviceError extends appError_1.AppError {
    constructor() {
        super("Duplikasi ruangan dan perangkat", 400, "DUPLICATE_ROOM_AND_DEVICE");
    }
}
exports.DuplicateRoomAndDeviceError = DuplicateRoomAndDeviceError;
class DeviceHasActiveSessionError extends appError_1.AppError {
    constructor() {
        super("Perangkat memiliki riwayat session dan tidak dapat dihapus", 400, "DEVICE_HAS_ACTIVE_SESSION");
    }
}
exports.DeviceHasActiveSessionError = DeviceHasActiveSessionError;
class DeviceHasOrderItemsError extends appError_1.AppError {
    constructor() {
        super("Perangkat memiliki riwayat order dan tidak dapat dihapus", 400, "DEVICE_HAS_ORDER_ITEMS");
    }
}
exports.DeviceHasOrderItemsError = DeviceHasOrderItemsError;
//# sourceMappingURL=roomAndDeviceError.js.map