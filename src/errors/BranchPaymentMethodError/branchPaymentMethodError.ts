import { AppError } from "../appError";

export class BranchPaymentMethodNotFoundError extends AppError {
  constructor() {
    super(
      "Branch payment method tidak ditemukan",
      404,
      "BRANCH_PAYMENT_METHOD_NOT_FOUND",
    );
  }
}

export class BranchPaymentMethodAlreadyExistsError extends AppError {
  constructor(provider: string) {
    super(
      `Payment method ${provider} sudah ada untuk branch ini`,
      409,
      "BRANCH_PAYMENT_METHOD_ALREADY_EXISTS",
    );
  }
}

export class InvalidPaymentProviderError extends AppError {
  constructor() {
    super("Payment provider tidak valid", 400, "INVALID_PAYMENT_PROVIDER");
  }
}

export class InvalidPaymentMethodError extends AppError {
  constructor() {
    super("Payment method tidak valid", 400, "INVALID_PAYMENT_METHOD");
  }
}
