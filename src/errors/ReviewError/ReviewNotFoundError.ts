export class ReviewNotFoundError extends Error {
  constructor(message: string = "Review tidak ditemukan") {
    super(message);
    this.name = "ReviewNotFoundError";
  }
}
