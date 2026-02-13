"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidEmailFormatError = exports.FailedSendingEmailError = exports.WaitingForVerificationError = exports.TokenExpiredError = exports.EmailAlreadyVerifiedError = exports.EmailNotVerifiedError = exports.AuthHeaderMissingError = exports.OTPInvalidError = exports.PasswordError = exports.EmailNotFoundError = exports.EmailExistingError = exports.UserNotAllowedError = exports.UserNotFoundError = void 0;
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
    constructor(details) {
        super("Password anda tidak valid", 400, "PASSWORD_INVALID", details);
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
class EmailNotVerifiedError extends appError_1.AppError {
    constructor() {
        super("Email belum terverifikasi. Silakan verifikasi email Anda terlebih dahulu.", 401, "EMAIL_NOT_VERIFIED");
    }
}
exports.EmailNotVerifiedError = EmailNotVerifiedError;
class EmailAlreadyVerifiedError extends appError_1.AppError {
    constructor() {
        super("Email sudah terverifikasi.", 401, "EMAIL_ALREADY_VERIFIED");
    }
}
exports.EmailAlreadyVerifiedError = EmailAlreadyVerifiedError;
class TokenExpiredError extends appError_1.AppError {
    constructor() {
        super("Token telah kedaluwarsa", 401, "TOKEN_EXPIRED");
    }
}
exports.TokenExpiredError = TokenExpiredError;
class WaitingForVerificationError extends appError_1.AppError {
    constructor(remainingSeconds) {
        super(`Tunggu ${remainingSeconds} detik sebelum mengirim ulang email verifikasi`, 429, "WAITING_FOR_VERIFICATION");
    }
}
exports.WaitingForVerificationError = WaitingForVerificationError;
class FailedSendingEmailError extends appError_1.AppError {
    constructor() {
        super("Gagal mengirim email. Silakan coba lagi nanti.", 500, "FAILED_SENDING_EMAIL");
    }
}
exports.FailedSendingEmailError = FailedSendingEmailError;
class InvalidEmailFormatError extends appError_1.AppError {
    constructor() {
        super("Format email tidak valid", 400, "INVALID_EMAIL_FORMAT");
    }
}
exports.InvalidEmailFormatError = InvalidEmailFormatError;
//# sourceMappingURL=authError.js.map