"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasNoAccessError = exports.UserNotOwnerError = void 0;
const appError_1 = require("../appError");
class UserNotOwnerError extends appError_1.AppError {
    constructor() {
        super("Pengguna bukan pemilik", 403, "USER_NOT_OWNER");
    }
}
exports.UserNotOwnerError = UserNotOwnerError;
class HasNoAccessError extends appError_1.AppError {
    constructor() {
        super("Pengguna tidak memiliki akses", 403, "HAS_NO_ACCESS");
    }
}
exports.HasNoAccessError = HasNoAccessError;
//# sourceMappingURL=userError.js.map