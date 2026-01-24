export class UnauthorizedReviewAccessError extends Error {
  constructor(message: string = "Akses ke review ini tidak diizinkan") {
    super(message);
    this.name = "UnauthorizedReviewAccessError";
  }
}
