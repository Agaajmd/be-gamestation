"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingInPastError = void 0;
class BookingInPastError extends Error {
    constructor(message = "Tanggal atau waktu booking sudah lewat") {
        super(message);
        this.name = "BookingInPastError";
    }
}
exports.BookingInPastError = BookingInPastError;
//# sourceMappingURL=BookingInPastError.js.map