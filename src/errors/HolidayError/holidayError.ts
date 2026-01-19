import { AppError } from "../appError";

export class HolidayError extends AppError {
  constructor() {
    super("Tanggal tersebut adalah hari libur", 400, "DATE_IS_HOLIDAY");
  }
}