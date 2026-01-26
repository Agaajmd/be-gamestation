export declare class AppError extends Error {
    message: string;
    statusCode: number;
    code?: string | undefined;
    details?: any | undefined;
    constructor(message: string, statusCode: number, code?: string | undefined, details?: any | undefined);
}
//# sourceMappingURL=appError.d.ts.map