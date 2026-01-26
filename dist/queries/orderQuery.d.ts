export declare const OrderQuery: {
    findDuplicateOrder(roomAndDeviceId: bigint, branchId: bigint, customerId: bigint, bookingStart: Date, bookingEnd: Date): Promise<{
        id: bigint;
        createdAt: Date;
        price: import("@prisma/client-runtime-utils").Decimal;
        roomAndDeviceId: bigint;
        orderId: bigint;
        bookingStart: Date;
        bookingEnd: Date;
        durationMinutes: number;
        baseAmount: import("@prisma/client-runtime-utils").Decimal;
        categoryFee: import("@prisma/client-runtime-utils").Decimal;
        advanceBookingFee: import("@prisma/client-runtime-utils").Decimal;
    } | null>;
};
//# sourceMappingURL=orderQuery.d.ts.map