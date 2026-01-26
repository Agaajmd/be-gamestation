"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvanceBookingPriceNotFoundError = exports.AdvanceBookingPriceAlreadyExistsError = void 0;
const appError_1 = require("../appError");
class AdvanceBookingPriceAlreadyExistsError extends appError_1.AppError {
    constructor() {
        super("Advance booking price sudah ada", 409, "ADVANCE_BOOKING_PRICE_ALREADY_EXISTS");
    }
}
exports.AdvanceBookingPriceAlreadyExistsError = AdvanceBookingPriceAlreadyExistsError;
class AdvanceBookingPriceNotFoundError extends appError_1.AppError {
    constructor() {
        super("Advance booking price tidak ditemukan", 404, "ADVANCE_BOOKING_PRICE_NOT_FOUND");
    }
}
exports.AdvanceBookingPriceNotFoundError = AdvanceBookingPriceNotFoundError;
//# sourceMappingURL=advanceBookingPriceError.js.map