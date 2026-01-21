import { AppError } from "../appError";

export class HolidayError extends AppError {
  constructor() {
    super("Tanggal tersebut adalah hari libur", 400, "DATE_IS_HOLIDAY");
  }
}

export class YearInvalidError extends AppError {
  constructor() {
    super("Tahun tidak valid untuk sinkronisasi hari libur nasional", 400, "YEAR_NOT_VALID");
  }
}

export class FailedToFetchHolidaysError extends AppError {
  constructor() {
    super("Gagal mengambil data hari libur dari API eksternal", 500, "FAILED_TO_FETCH_HOLIDAYS");
  }
}

export class FormatResponseInvalidError extends AppError {
  constructor() {
    super("Format response dari API eksternal tidak valid", 500, "FORMAT_RESPONSE_INVALID");
  }
}

export class NationalHolidayNotFoundError extends AppError {
  constructor() {
    super("Libur nasional tidak ditemukan untuk tahun tersebut", 404, "NATIONAL_HOLIDAY_NOT_FOUND");
  }
}
