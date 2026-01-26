"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchNotFoundError = void 0;
const appError_1 = require("../appError");
class BranchNotFoundError extends appError_1.AppError {
    constructor() {
        super("Cabang tidak ditemukan", 404, "BRANCH_NOT_FOUND");
    }
}
exports.BranchNotFoundError = BranchNotFoundError;
//# sourceMappingURL=branchError.js.map