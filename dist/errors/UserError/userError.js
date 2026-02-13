"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAlreadyExistsError = exports.UserNotFoundError = exports.HasNoAccessError = exports.UserNotOwnerError = void 0;
const appError_1 = require("../appError");
class UserNotOwnerError extends appError_1.AppError {
    constructor() {
        super("Pengguna bukan pemilik", 403, "USER_NOT_OWNER");
    }
}
exports.UserNotOwnerError = UserNotOwnerError;
class HasNoAccessError extends appError_1.AppError {
    constructor() {
        super("Pengguna tidak memiliki akses", 403, "HAS_NO_ACCESS");
    }
}
exports.HasNoAccessError = HasNoAccessError;
class UserNotFoundError extends appError_1.AppError {
    constructor() {
        super("User tidak ditemukan", 404, "USER_NOT_FOUND");
    }
}
exports.UserNotFoundError = UserNotFoundError;
class EmailAlreadyExistsError extends appError_1.AppError {
    constructor() {
        super("Email sudah terdaftar", 409, "EMAIL_ALREADY_EXISTS");
    }
}
exports.EmailAlreadyExistsError = EmailAlreadyExistsError;
//# sourceMappingURL=userError.js.map