export class InvalidOrderStatusError extends Error {
  constructor(message: string = "Status order tidak valid") {
    super(message);
    this.name = "InvalidOrderStatusError";
  }
}
