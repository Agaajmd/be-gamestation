import { AppError } from "../appError";

export class AnnouncementNotFoundError extends AppError {
  constructor() {
    super("Announcement tidak ditemukan", 404, "ANNOUNCEMENT_NOT_FOUND");
  }
}

export class InvalidAnnouncementDateError extends AppError {
  constructor() {
    super(
      "Tanggal berakhir harus lebih besar dari tanggal mulai",
      400,
      "INVALID_ANNOUNCEMENT_DATE",
    );
  }
}

export class AnnouncementAlreadyExpiredError extends AppError {
  constructor() {
    super("Announcement sudah kadaluarsa", 400, "ANNOUNCEMENT_ALREADY_EXPIRED");
  }
}

export class UnauthorizedAnnouncementAccessError extends AppError {
  constructor() {
    super(
      "Tidak memiliki akses untuk mengedit announcement ini",
      403,
      "UNAUTHORIZED_ANNOUNCEMENT_ACCESS",
    );
  }
}
