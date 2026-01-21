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