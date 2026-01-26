export declare function addAdvanceBookingPriceService(payload: {
    branchId: bigint;
    minDays: number;
    maxDays: number | null;
    additionalFee: number;
}): Promise<{
    id: bigint;
    createdAt: Date;
    branchId: bigint;
    minDays: number;
    maxDays: number;
    additionalFee: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare function updateAdvanceBookingPriceService(payload: {
    id: bigint;
    minDays?: number;
    maxDays?: number | null;
    additionalFee?: number;
}): Promise<{
    id: bigint;
    createdAt: Date;
    branchId: bigint;
    minDays: number;
    maxDays: number;
    additionalFee: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare function deleteAdvanceBookingPriceService(id: bigint): Promise<{
    id: bigint;
    createdAt: Date;
    branchId: bigint;
    minDays: number;
    maxDays: number;
    additionalFee: import("@prisma/client-runtime-utils").Decimal;
}>;
//# sourceMappingURL=advanceBookingPriceService.d.ts.map