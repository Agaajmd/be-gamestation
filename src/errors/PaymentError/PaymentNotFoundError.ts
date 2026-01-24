export class PaymentNotFoundError extends Error {
  constructor(message: string = "Payment tidak ditemukan") {
    super(message);
    this.name = "PaymentNotFoundError";
  }
}
