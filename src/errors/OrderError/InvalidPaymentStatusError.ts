export class InvalidPaymentStatusError extends Error {
  constructor(message: string = "Status pembayaran tidak valid") {
    super(message);
    this.name = "InvalidPaymentStatusError";
  }
}
