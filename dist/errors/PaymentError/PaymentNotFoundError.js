"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentNotFoundError = void 0;
class PaymentNotFoundError extends Error {
    constructor(message = "Payment tidak ditemukan") {
        super(message);
        this.name = "PaymentNotFoundError";
    }
}
exports.PaymentNotFoundError = PaymentNotFoundError;
//# sourceMappingURL=PaymentNotFoundError.js.map