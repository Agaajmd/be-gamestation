export class UnauthorizedOrderAccessError extends Error {
  constructor(message: string = "Akses ke order ini tidak diizinkan") {
    super(message);
    this.name = "UnauthorizedOrderAccessError";
  }
}
