import { AppError } from "../appError";

export class BranchNotFoundError extends AppError {
  constructor() {
    super("Cabang tidak ditemukan", 404, "BRANCH_NOT_FOUND");
  }
}
