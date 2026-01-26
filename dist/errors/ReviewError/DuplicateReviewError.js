"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateReviewError = void 0;
class DuplicateReviewError extends Error {
    constructor(message = "Review untuk order ini sudah ada") {
        super(message);
        this.name = "DuplicateReviewError";
    }
}
exports.DuplicateReviewError = DuplicateReviewError;
//# sourceMappingURL=DuplicateReviewError.js.map