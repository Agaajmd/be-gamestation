import { AppError } from "../appError";

export class UserNotOwnerError extends AppError {
  constructor() {
    super("Pengguna bukan pemilik", 403, "USER_NOT_OWNER");
  }
}