"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHeaderMissingError = exports.OTPInvalidError = exports.PasswordError = exports.EmailNotFoundError = exports.EmailExistingError = exports.UserNotAllowedError = exports.UserNotFoundError = void 0;
const appError_1 = require("../appError");
class UserNotFoundError extends appError_1.AppError {
    constructor() {
        super("User tidak ditemukan", 404, "USER_NOT_FOUND");
    }
}
exports.UserNotFoundError = UserNotFoundError;
class UserNotAllowedError extends appError_1.AppError {
    constructor() {
        super("User tidak memiliki izin untuk melakukan aksi ini", 403, "USER_NOT_ALLOWED");
    }
}
exports.UserNotAllowedError = UserNotAllowedError;
class EmailExistingError extends appError_1.AppError {
    constructor() {
        super("Email sudah terdaftar", 400, "EMAIL_ALREADY_EXISTS");
    }
}
exports.EmailExistingError = EmailExistingError;
class EmailNotFoundError extends appError_1.AppError {
    constructor() {
        super("Email tidak ditemukan", 404, "EMAIL_NOT_FOUND");
    }
}
exports.EmailNotFoundError = EmailNotFoundError;
class PasswordError extends appError_1.AppError {
    constructor() {
        super("Password anda tidak valid", 400, "PASSWORD_INVALID");
    }
}
exports.PasswordError = PasswordError;
class OTPInvalidError extends appError_1.AppError {
    constructor() {
        super("OTP tidak valid atau sudah expired", 401, "OTP_INVALID_OR_EXPIRED");
    }
}
exports.OTPInvalidError = OTPInvalidError;
class AuthHeaderMissingError extends appError_1.AppError {
    constructor() {
        super("Header Authorization wajib diisi", 401, "AUTH_HEADER_MISSING");
    }
}
exports.AuthHeaderMissingError = AuthHeaderMissingError;
//# sourceMappingURL=authError.js.map