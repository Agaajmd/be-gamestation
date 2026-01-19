import { AppError } from "../appError";

export class UserNotFoundError extends AppError {
  constructor() {
    super("User tidak ditemukan", 404, "USER_NOT_FOUND");
  }
}

export class UserNotAllowedError extends AppError {
  constructor() {
    super("User tidak memiliki izin untuk melakukan aksi ini", 403, "USER_NOT_ALLOWED");
  }
}

export class EmailExistingError extends AppError {
  constructor() {
    super("Email sudah terdaftar", 400, "EMAIL_ALREADY_EXISTS");
  }
}

export class EmailNotFoundError extends AppError {
  constructor() {
    super("Email tidak ditemukan", 404, "EMAIL_NOT_FOUND");
  }
}

export class PasswordError extends AppError {
  constructor() {
    super("Password anda tidak valid", 400, "PASSWORD_INVALID");
  }
}

export class OTPInvalidError extends AppError {
  constructor() {
    super("OTP tidak valid atau sudah expired", 401, "OTP_INVALID_OR_EXPIRED");
  }
}

export class AuthHeaderMissingError extends AppError {
  constructor() {
    super("Header Authorization wajib diisi", 401, "AUTH_HEADER_MISSING");
  }
}
