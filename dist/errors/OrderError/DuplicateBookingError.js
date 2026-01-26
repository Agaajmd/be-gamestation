"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateBookingError = void 0;
class DuplicateBookingError extends Error {
    constructor(message = "Device sudah ada di keranjang atau terbooking untuk jadwal yang sama") {
        super(message);
        this.name = "DuplicateBookingError";
    }
}
exports.DuplicateBookingError = DuplicateBookingError;
//# sourceMappingURL=DuplicateBookingError.js.map