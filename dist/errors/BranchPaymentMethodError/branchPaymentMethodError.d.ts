import { AppError } from "../appError";
export declare class BranchPaymentMethodNotFoundError extends AppError {
    constructor();
}
export declare class BranchPaymentMethodAlreadyExistsError extends AppError {
    constructor(provider: string);
}
export declare class InvalidPaymentProviderError extends AppError {
    constructor();
}
export declare class InvalidPaymentMethodError extends AppError {
    constructor();
}
//# sourceMappingURL=branchPaymentMethodError.d.ts.map