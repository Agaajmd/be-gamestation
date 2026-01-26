"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchNotFoundError = void 0;
class BranchNotFoundError extends Error {
    constructor(message = "Branch tidak ditemukan") {
        super(message);
        this.name = "BranchNotFoundError";
    }
}
exports.BranchNotFoundError = BranchNotFoundError;
//# sourceMappingURL=BranchNotFoundError.js.map