"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderNotCompletedError = exports.UnauthorizedOrderAccessError = exports.InvalidPaymentStatusError = exports.InvalidOrderStatusError = exports.OrderNotFoundError = exports.DuplicateBookingError = exports.BookingInPastError = void 0;
const appError_1 = require("../appError");
class BookingInPastError extends appError_1.AppError {
    constructor() {
        super("Waktu booking tidak boleh di masa lalu", 400, "BOOKING_IN_PAST");
    }
}
exports.BookingInPastError = BookingInPastError;
class DuplicateBookingError extends appError_1.AppError {
    constructor() {
        super("Device sudah ada di keranjang atau terbooking untuk jadwal yang sama", 400, "DUPLICATE_BOOKING");
    }
}
exports.DuplicateBookingError = DuplicateBookingError;
class OrderNotFoundError extends appError_1.AppError {
    constructor() {
        super("Order tidak ditemukan", 404, "ORDER_NOT_FOUND");
    }
}
exports.OrderNotFoundError = OrderNotFoundError;
class InvalidOrderStatusError extends appError_1.AppError {
    constructor() {
        super("Status order tidak valid untuk aksi ini", 400, "INVALID_ORDER_STATUS");
    }
}
exports.InvalidOrderStatusError = InvalidOrderStatusError;
class InvalidPaymentStatusError extends appError_1.AppError {
    constructor() {
        super("Status pembayaran tidak valid", 400, "INVALID_PAYMENT_STATUS");
    }
}
exports.InvalidPaymentStatusError = InvalidPaymentStatusError;
class UnauthorizedOrderAccessError extends appError_1.AppError {
    constructor() {
        super("Tidak memiliki akses ke order ini", 403, "UNAUTHORIZED_ORDER_ACCESS");
    }
}
exports.UnauthorizedOrderAccessError = UnauthorizedOrderAccessError;
class OrderNotCompletedError extends appError_1.AppError {
    constructor() {
        super("Order belum selesai", 400, "ORDER_NOT_COMPLETED");
    }
}
exports.OrderNotCompletedError = OrderNotCompletedError;
//# sourceMappingURL=orderError.js.map