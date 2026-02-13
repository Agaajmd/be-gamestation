"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedAnnouncementAccessError = exports.AnnouncementAlreadyExpiredError = exports.InvalidAnnouncementDateError = exports.AnnouncementNotFoundError = void 0;
const appError_1 = require("../appError");
class AnnouncementNotFoundError extends appError_1.AppError {
    constructor() {
        super("Announcement tidak ditemukan", 404, "ANNOUNCEMENT_NOT_FOUND");
    }
}
exports.AnnouncementNotFoundError = AnnouncementNotFoundError;
class InvalidAnnouncementDateError extends appError_1.AppError {
    constructor() {
        super("Tanggal berakhir harus lebih besar dari tanggal mulai", 400, "INVALID_ANNOUNCEMENT_DATE");
    }
}
exports.InvalidAnnouncementDateError = InvalidAnnouncementDateError;
class AnnouncementAlreadyExpiredError extends appError_1.AppError {
    constructor() {
        super("Announcement sudah kadaluarsa", 400, "ANNOUNCEMENT_ALREADY_EXPIRED");
    }
}
exports.AnnouncementAlreadyExpiredError = AnnouncementAlreadyExpiredError;
class UnauthorizedAnnouncementAccessError extends appError_1.AppError {
    constructor() {
        super("Tidak memiliki akses untuk mengedit announcement ini", 403, "UNAUTHORIZED_ANNOUNCEMENT_ACCESS");
    }
}
exports.UnauthorizedAnnouncementAccessError = UnauthorizedAnnouncementAccessError;
//# sourceMappingURL=announcementError.js.map