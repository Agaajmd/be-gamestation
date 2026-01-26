"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminNotFoundError = exports.ExistingAdminError = void 0;
const appError_1 = require("../appError");
class ExistingAdminError extends appError_1.AppError {
    constructor() {
        super("User sudah menjadi admin di cabang lain", 400, "ADMIN_ALREADY_EXISTS");
    }
}
exports.ExistingAdminError = ExistingAdminError;
class AdminNotFoundError extends appError_1.AppError {
    constructor() {
        super("Admin tidak ditemukan", 404, "ADMIN_NOT_FOUND");
    }
}
exports.AdminNotFoundError = AdminNotFoundError;
//# sourceMappingURL=adminError.js.map