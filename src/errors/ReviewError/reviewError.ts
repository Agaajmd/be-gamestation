import { AppError } from "../appError";

export class InvalidRatingError extends AppError {
    constructor() {
        super("Rating harus antara 1-5", 400, "INVALID_RATING");
    }
}

export class UnauthorizedReviewAccessError extends AppError {
    constructor() {
        super("Akses ulasan tidak sah", 403, "UNAUTHORIZED_REVIEW_ACCESS");
    }
}