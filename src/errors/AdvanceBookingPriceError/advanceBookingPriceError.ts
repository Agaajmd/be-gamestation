import { AppError } from "../appError";

export class AdvanceBookingPriceAlreadyExistsError extends AppError {
  constructor() {
    super(
      "Advance booking price sudah ada",
      409,
      "ADVANCE_BOOKING_PRICE_ALREADY_EXISTS",
    );
  }
}

export class AdvanceBookingPriceNotFoundError extends AppError {
  constructor() {
    super(
      "Advance booking price tidak ditemukan",
      404,
      "ADVANCE_BOOKING_PRICE_NOT_FOUND",
    );
  }
}

export class InvalidAdvanceBookingPriceRangeError extends AppError {
  constructor() {
    super(
      "Rentang hari tidak valid: minDays harus kurang dari atau sama dengan maxDays",
      400,
      "INVALID_ADVANCE_BOOKING_PRICE_RANGE",
    );
  }
}

export class InvalidMinDaysError extends AppError {
  constructor() {
    super("Min days tidak valid", 400, "INVALID_MIN_DAYS");
  }
}

export class InvalidMaxDaysError extends AppError {
  constructor() {
    super("Max days tidak valid", 400, "INVALID_MAX_DAYS");
  }
}

export class InvalidAdditionalFeeError extends AppError {
  constructor() {
    super("Additional fee tidak valid", 400, "INVALID_ADDITIONAL_FEE");
  }
}

export class MultipleUnlimitedRangesError extends AppError {
  constructor() {
    super(
      "Tidak boleh memiliki lebih dari satu rentang unlimited (maxDays = null) per cabang",
      409,
      "MULTIPLE_UNLIMITED_RANGES",
    );
  }
}

export class RangeOverlapError extends AppError {
  constructor(existingMin: number, existingMax: number | null) {
    super(
      `Sudah ada rentang hari serupa: ${existingMin}-${existingMax || "unlimited"}`,
      409,
      "RANGE_OVERLAP",
    );
  }
}
