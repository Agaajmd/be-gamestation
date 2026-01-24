export class DuplicateBookingError extends Error {
  constructor(
    message: string = "Device sudah ada di keranjang atau terbooking untuk jadwal yang sama",
  ) {
    super(message);
    this.name = "DuplicateBookingError";
  }
}
