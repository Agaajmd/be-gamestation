"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedReviewAccessError = void 0;
class UnauthorizedReviewAccessError extends Error {
    constructor(message = "Akses ke review ini tidak diizinkan") {
        super(message);
        this.name = "UnauthorizedReviewAccessError";
    }
}
exports.UnauthorizedReviewAccessError = UnauthorizedReviewAccessError;
//# sourceMappingURL=UnauthorizedReviewAccessError.js.map