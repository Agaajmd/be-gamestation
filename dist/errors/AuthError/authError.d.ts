import { AppError } from "../appError";
export declare class UserNotFoundError extends AppError {
    constructor();
}
export declare class UserNotAllowedError extends AppError {
    constructor();
}
export declare class EmailExistingError extends AppError {
    constructor();
}
export declare class EmailNotFoundError extends AppError {
    constructor();
}
export declare class PasswordError extends AppError {
    constructor(details?: string[]);
}
export declare class OTPInvalidError extends AppError {
    constructor();
}
export declare class AuthHeaderMissingError extends AppError {
    constructor();
}
export declare class EmailNotVerifiedError extends AppError {
    constructor();
}
export declare class EmailAlreadyVerifiedError extends AppError {
    constructor();
}
export declare class TokenExpiredError extends AppError {
    constructor();
}
export declare class WaitingForVerificationError extends AppError {
    constructor(remainingSeconds: number);
}
export declare class FailedSendingEmailError extends AppError {
    constructor();
}
export declare class InvalidEmailFormatError extends AppError {
    constructor();
}
//# sourceMappingURL=authError.d.ts.map