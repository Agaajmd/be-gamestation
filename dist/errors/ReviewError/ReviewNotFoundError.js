"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewNotFoundError = void 0;
class ReviewNotFoundError extends Error {
    constructor(message = "Review tidak ditemukan") {
        super(message);
        this.name = "ReviewNotFoundError";
    }
}
exports.ReviewNotFoundError = ReviewNotFoundError;
//# sourceMappingURL=ReviewNotFoundError.js.map