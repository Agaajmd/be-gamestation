export class DuplicatePaymentError extends Error {
  constructor(message: string = "Payment untuk order ini sudah ada") {
    super(message);
    this.name = "DuplicatePaymentError";
  }
}
