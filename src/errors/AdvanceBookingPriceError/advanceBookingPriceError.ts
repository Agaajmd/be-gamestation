import { AppError } from "../appError";

export class AdvanceBookingPriceAlreadyExistsError extends AppError {
  constructor() {
    super(
      "Advance booking price sudah ada",
      409,
      "ADVANCE_BOOKING_PRICE_ALREADY_EXISTS"
    );
  }
}

export class AdvanceBookingPriceNotFoundError extends AppError {
  constructor() {
    super(
      "Advance booking price tidak ditemukan",
      404,
      "ADVANCE_BOOKING_PRICE_NOT_FOUND"
    );
  }
}
