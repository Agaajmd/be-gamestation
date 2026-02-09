import { AppError } from "../appError";

export class UserNotFoundError extends AppError {
  constructor() {
    super("User tidak ditemukan", 404, "USER_NOT_FOUND");
  }
}

export class UserNotAllowedError extends AppError {
  constructor() {
    super(
      "User tidak memiliki izin untuk melakukan aksi ini",
      403,
      "USER_NOT_ALLOWED",
    );
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
  constructor(details?: string[]) {
    super("Password anda tidak valid", 400, "PASSWORD_INVALID", details);
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

export class EmailNotVerifiedError extends AppError {
  constructor() {
    super(
      "Email belum terverifikasi. Silakan verifikasi email Anda terlebih dahulu.",
      401,
      "EMAIL_NOT_VERIFIED",
    );
  }
}

export class EmailAlreadyVerifiedError extends AppError {
  constructor() {
    super("Email sudah terverifikasi.", 401, "EMAIL_ALREADY_VERIFIED");
  }
}

export class TokenExpiredError extends AppError {
  constructor() {
    super("Token telah kedaluwarsa", 401, "TOKEN_EXPIRED");
  }
}

export class WaitingForVerificationError extends AppError {
  constructor(remainingSeconds: number) {
    super(
      `Tunggu ${remainingSeconds} detik sebelum mengirim ulang email verifikasi`,
      429,
      "WAITING_FOR_VERIFICATION",
    );
  }
}

export class FailedSendingEmailError extends AppError {
  constructor() {
    super(
      "Gagal mengirim email. Silakan coba lagi nanti.",
      500,
      "FAILED_SENDING_EMAIL",
    );
  }
}

export class InvalidEmailFormatError extends AppError { 
  constructor() {
    super("Format email tidak valid", 400, "INVALID_EMAIL_FORMAT");
  }
}
