"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicatePaymentError = void 0;
class DuplicatePaymentError extends Error {
    constructor(message = "Payment untuk order ini sudah ada") {
        super(message);
        this.name = "DuplicatePaymentError";
    }
}
exports.DuplicatePaymentError = DuplicatePaymentError;
//# sourceMappingURL=DuplicatePaymentError.js.map