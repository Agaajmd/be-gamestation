import { AppError } from "../appError";

export class ExistingAdminError extends AppError {
  constructor() {
    super(
      "User sudah menjadi admin di cabang lain",
      400,
      "ADMIN_ALREADY_EXISTS"
    );
  }
}

export class AdminNotFoundError extends AppError {
  constructor() {
    super("Admin tidak ditemukan", 404, "ADMIN_NOT_FOUND");
  }
}