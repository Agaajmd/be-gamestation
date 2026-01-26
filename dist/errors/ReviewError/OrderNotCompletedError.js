"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderNotCompletedError = void 0;
class OrderNotCompletedError extends Error {
    constructor(message = "Review hanya bisa dibuat untuk order yang sudah completed") {
        super(message);
        this.name = "OrderNotCompletedError";
    }
}
exports.OrderNotCompletedError = OrderNotCompletedError;
//# sourceMappingURL=OrderNotCompletedError.js.map