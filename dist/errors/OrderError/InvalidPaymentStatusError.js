"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPaymentStatusError = void 0;
class InvalidPaymentStatusError extends Error {
    constructor(message = "Status pembayaran tidak valid") {
        super(message);
        this.name = "InvalidPaymentStatusError";
    }
}
exports.InvalidPaymentStatusError = InvalidPaymentStatusError;
//# sourceMappingURL=InvalidPaymentStatusError.js.map