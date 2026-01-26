"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOrderStatusError = void 0;
class InvalidOrderStatusError extends Error {
    constructor(message = "Status order tidak valid") {
        super(message);
        this.name = "InvalidOrderStatusError";
    }
}
exports.InvalidOrderStatusError = InvalidOrderStatusError;
//# sourceMappingURL=InvalidOrderStatusError.js.map