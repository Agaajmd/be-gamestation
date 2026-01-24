export class OrderNotCompletedError extends Error {
  constructor(
    message: string = "Review hanya bisa dibuat untuk order yang sudah completed",
  ) {
    super(message);
    this.name = "OrderNotCompletedError";
  }
}
