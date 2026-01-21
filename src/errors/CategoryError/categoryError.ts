import { AppError } from "../appError";

export class CategoryAlreadyExistsError extends AppError {
  constructor() {
    super(
      "Kategori dengan nama yang sama sudah ada",
      400,
      "CATEGORY_ALREADY_EXISTS",
    );
  }
}

export class CategoryNotFoundError extends AppError {
  constructor() {
    super("Kategori tidak ditemukan", 404, "CATEGORY_NOT_FOUND");
  }
}

export class CategoryHasDevicesError extends AppError {
  constructor() {
    super(
      "Tidak dapat menghapus kategori yang masih digunakan oleh device",
      400,
      "CATEGORY_HAS_DEVICES",
    );
  }
}
