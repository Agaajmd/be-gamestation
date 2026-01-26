"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedReviewAccessError = exports.InvalidRatingError = void 0;
const appError_1 = require("../appError");
class InvalidRatingError extends appError_1.AppError {
    constructor() {
        super("Rating harus antara 1-5", 400, "INVALID_RATING");
    }
}
exports.InvalidRatingError = InvalidRatingError;
class UnauthorizedReviewAccessError extends appError_1.AppError {
    constructor() {
        super("Akses ulasan tidak sah", 403, "UNAUTHORIZED_REVIEW_ACCESS");
    }
}
exports.UnauthorizedReviewAccessError = UnauthorizedReviewAccessError;
//# sourceMappingURL=reviewError.js.map