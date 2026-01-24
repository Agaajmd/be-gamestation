export class InvalidPaymentStatusError extends Error {
  constructor(message: string = "Status payment tidak valid") {
    super(message);
    this.name = "InvalidPaymentStatusError";
  }
}
