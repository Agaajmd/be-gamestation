"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedOrderAccessError = void 0;
class UnauthorizedOrderAccessError extends Error {
    constructor(message = "Akses ke order ini tidak diizinkan") {
        super(message);
        this.name = "UnauthorizedOrderAccessError";
    }
}
exports.UnauthorizedOrderAccessError = UnauthorizedOrderAccessError;
//# sourceMappingURL=UnauthorizedOrderAccessError.js.map