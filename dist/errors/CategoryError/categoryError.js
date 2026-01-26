"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryHasDevicesError = exports.CategoryNotFoundError = exports.CategoryAlreadyExistsError = void 0;
const appError_1 = require("../appError");
class CategoryAlreadyExistsError extends appError_1.AppError {
    constructor() {
        super("Kategori dengan nama yang sama sudah ada", 400, "CATEGORY_ALREADY_EXISTS");
    }
}
exports.CategoryAlreadyExistsError = CategoryAlreadyExistsError;
class CategoryNotFoundError extends appError_1.AppError {
    constructor() {
        super("Kategori tidak ditemukan", 404, "CATEGORY_NOT_FOUND");
    }
}
exports.CategoryNotFoundError = CategoryNotFoundError;
class CategoryHasDevicesError extends appError_1.AppError {
    constructor() {
        super("Tidak dapat menghapus kategori yang masih digunakan oleh device", 400, "CATEGORY_HAS_DEVICES");
    }
}
exports.CategoryHasDevicesError = CategoryHasDevicesError;
//# sourceMappingURL=categoryError.js.map