export class DuplicateReviewError extends Error {
  constructor(message: string = "Review untuk order ini sudah ada") {
    super(message);
    this.name = "DuplicateReviewError";
  }
}
