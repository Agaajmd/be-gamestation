export declare const OrderItemRepository: {
    findFirst(where: object, options?: object): import("@prisma/client").Prisma.Prisma__OrderItemClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(data: any): import("@prisma/client").Prisma.Prisma__OrderItemClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=orderItemRepository.d.ts.map