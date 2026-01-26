"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryNotFoundError = void 0;
class CategoryNotFoundError extends Error {
    constructor(message = "Kategori tidak ditemukan atau tidak sesuai dengan cabang") {
        super(message);
        this.name = "CategoryNotFoundError";
    }
}
exports.CategoryNotFoundError = CategoryNotFoundError;
//# sourceMappingURL=CategoryNotFoundError.js.map