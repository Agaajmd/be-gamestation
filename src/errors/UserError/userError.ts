import { AppError } from "../appError";

export class UserNotOwnerError extends AppError {
  constructor() {
    super("Pengguna bukan pemilik", 403, "USER_NOT_OWNER");
  }
}

export class HasNoAccessError extends AppError {
  constructor() {
    super("Pengguna tidak memiliki akses", 403, "HAS_NO_ACCESS");
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("User tidak ditemukan", 404, "USER_NOT_FOUND");
  }
}

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super("Email sudah terdaftar", 409, "EMAIL_ALREADY_EXISTS");
  }
}
