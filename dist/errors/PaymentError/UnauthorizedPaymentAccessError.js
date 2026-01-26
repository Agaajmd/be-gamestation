"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedPaymentAccessError = void 0;
class UnauthorizedPaymentAccessError extends Error {
    constructor(message = "Akses ke payment ini tidak diizinkan") {
        super(message);
        this.name = "UnauthorizedPaymentAccessError";
    }
}
exports.UnauthorizedPaymentAccessError = UnauthorizedPaymentAccessError;
//# sourceMappingURL=UnauthorizedPaymentAccessError.js.map