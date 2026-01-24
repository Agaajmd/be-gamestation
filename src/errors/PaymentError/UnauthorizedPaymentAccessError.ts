export class UnauthorizedPaymentAccessError extends Error {
  constructor(message: string = "Akses ke payment ini tidak diizinkan") {
    super(message);
    this.name = "UnauthorizedPaymentAccessError";
  }
}
