import { AppError } from "../appError";

export class BookingInPastError extends AppError {
  constructor() {
    super("Waktu booking tidak boleh di masa lalu", 400, "BOOKING_IN_PAST");
  }
}

export class DuplicateBookingError extends AppError {
  constructor() {
    super(
      "Device sudah ada di keranjang atau terbooking untuk jadwal yang sama",
      400,
      "DUPLICATE_BOOKING",
    );
  }
}

export class OrderNotFoundError extends AppError {
  constructor() {
    super("Order tidak ditemukan", 404, "ORDER_NOT_FOUND");
  }
}

export class InvalidOrderStatusError extends AppError {
  constructor() {
    super(
      "Status order tidak valid untuk aksi ini",
      400,
      "INVALID_ORDER_STATUS",
    );
  }
}

export class InvalidPaymentStatusError extends AppError {
  constructor() {
    super("Status pembayaran tidak valid", 400, "INVALID_PAYMENT_STATUS");
  }
}

export class UnauthorizedOrderAccessError extends AppError {
  constructor() {
    super(
      "Tidak memiliki akses ke order ini",
      403,
      "UNAUTHORIZED_ORDER_ACCESS",
    );
  }
}

export class OrderNotCompletedError extends AppError {
  constructor() {
    super("Order belum selesai", 400, "ORDER_NOT_COMPLETED");
  }
}

export class MissingCustomerIdentifierError extends AppError {
  constructor() {
    super(
      "Harus memberikan customerId atau nama lengkap customer",
      400,
      "MISSING_CUSTOMER_IDENTIFIER",
    );
  }
}

export class MissingGuestCustomerPhoneError extends AppError {
  constructor() {
    super(
      "Harus memberikan nomor telepon customer untuk guest order",
      400,
      "MISSING_GUEST_CUSTOMER_PHONE",
    );
  }
}

export class InvalidCartItemsError extends AppError {
  constructor(invalidItems: any[]) {
    const itemCount = invalidItems.length;
    super(
      `${itemCount} item di keranjang tidak valid lagi. Silakan periksa dan hapus item yang tidak valid.`,
      400,
      "INVALID_CART_ITEMS",
      { invalidItems }, // Pass as details
    );
  }
}
