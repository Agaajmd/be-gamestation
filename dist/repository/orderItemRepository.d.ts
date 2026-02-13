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
    findMany(where: object, options?: object): import("@prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
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
    findById(id: bigint, options?: object): import("@prisma/client").Prisma.Prisma__OrderItemClient<{
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
    delete(id: bigint): import("@prisma/client").Prisma.Prisma__OrderItemClient<{
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