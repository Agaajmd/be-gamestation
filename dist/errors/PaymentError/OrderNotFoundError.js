"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderNotFoundError = void 0;
class OrderNotFoundError extends Error {
    constructor(message = "Order tidak ditemukan") {
        super(message);
        this.name = "OrderNotFoundError";
    }
}
exports.OrderNotFoundError = OrderNotFoundError;
//# sourceMappingURL=OrderNotFoundError.js.map