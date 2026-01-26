"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NationalHolidayNotFoundError = exports.FormatResponseInvalidError = exports.FailedToFetchHolidaysError = exports.YearInvalidError = exports.HolidayError = void 0;
const appError_1 = require("../appError");
class HolidayError extends appError_1.AppError {
    constructor() {
        super("Tanggal tersebut adalah hari libur", 400, "DATE_IS_HOLIDAY");
    }
}
exports.HolidayError = HolidayError;
class YearInvalidError extends appError_1.AppError {
    constructor() {
        super("Tahun tidak valid untuk sinkronisasi hari libur nasional", 400, "YEAR_NOT_VALID");
    }
}
exports.YearInvalidError = YearInvalidError;
class FailedToFetchHolidaysError extends appError_1.AppError {
    constructor() {
        super("Gagal mengambil data hari libur dari API eksternal", 500, "FAILED_TO_FETCH_HOLIDAYS");
    }
}
exports.FailedToFetchHolidaysError = FailedToFetchHolidaysError;
class FormatResponseInvalidError extends appError_1.AppError {
    constructor() {
        super("Format response dari API eksternal tidak valid", 500, "FORMAT_RESPONSE_INVALID");
    }
}
exports.FormatResponseInvalidError = FormatResponseInvalidError;
class NationalHolidayNotFoundError extends appError_1.AppError {
    constructor() {
        super("Libur nasional tidak ditemukan untuk tahun tersebut", 404, "NATIONAL_HOLIDAY_NOT_FOUND");
    }
}
exports.NationalHolidayNotFoundError = NationalHolidayNotFoundError;
//# sourceMappingURL=holidayError.js.map