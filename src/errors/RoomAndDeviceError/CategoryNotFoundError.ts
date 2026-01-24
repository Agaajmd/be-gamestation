export class CategoryNotFoundError extends Error {
  constructor(
    message: string = "Kategori tidak ditemukan atau tidak sesuai dengan cabang",
  ) {
    super(message);
    this.name = "CategoryNotFoundError";
  }
}
