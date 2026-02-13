"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPaymentMethodError = exports.InvalidPaymentProviderError = exports.BranchPaymentMethodAlreadyExistsError = exports.BranchPaymentMethodNotFoundError = void 0;
const appError_1 = require("../appError");
class BranchPaymentMethodNotFoundError extends appError_1.AppError {
    constructor() {
        super("Branch payment method tidak ditemukan", 404, "BRANCH_PAYMENT_METHOD_NOT_FOUND");
    }
}
exports.BranchPaymentMethodNotFoundError = BranchPaymentMethodNotFoundError;
class BranchPaymentMethodAlreadyExistsError extends appError_1.AppError {
    constructor(provider) {
        super(`Payment method ${provider} sudah ada untuk branch ini`, 409, "BRANCH_PAYMENT_METHOD_ALREADY_EXISTS");
    }
}
exports.BranchPaymentMethodAlreadyExistsError = BranchPaymentMethodAlreadyExistsError;
class InvalidPaymentProviderError extends appError_1.AppError {
    constructor() {
        super("Payment provider tidak valid", 400, "INVALID_PAYMENT_PROVIDER");
    }
}
exports.InvalidPaymentProviderError = InvalidPaymentProviderError;
class InvalidPaymentMethodError extends appError_1.AppError {
    constructor() {
        super("Payment method tidak valid", 400, "INVALID_PAYMENT_METHOD");
    }
}
exports.InvalidPaymentMethodError = InvalidPaymentMethodError;
//# sourceMappingURL=branchPaymentMethodError.js.map