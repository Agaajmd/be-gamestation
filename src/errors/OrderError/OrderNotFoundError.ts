export class OrderNotFoundError extends Error {
  constructor(message: string = "Order tidak ditemukan") {
    super(message);
    this.name = "OrderNotFoundError";
  }
}
