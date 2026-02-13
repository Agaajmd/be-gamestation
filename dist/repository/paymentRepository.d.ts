export declare const PaymentRepository: {
    findById(paymentId: bigint): import("@prisma/client").Prisma.Prisma__PaymentClient<({
        order: {
            customer: {
                id: bigint;
                email: string;
                phone: string | null;
                fullName: never;
            };
            branch: {
                name: string;
                id: bigint;
                phone: string | null;
                address: string | null;
            };
            orderItems: ({
                roomAndDevice: {
                    name: string;
                    id: bigint;
                    createdAt: Date;
                    updatedAt: Date | null;
                    branchId: bigint;
                    status: import("@prisma/client").$Enums.RoomAndDeviceStatus;
                    pricePerHour: import("@prisma/client-runtime-utils").Decimal;
                    categoryId: bigint | null;
                    deviceType: import("@prisma/client").$Enums.DeviceType;
                    version: import("@prisma/client").$Enums.DeviceVersion | null;
                    roomNumber: string | null;
                };
            } & {
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
            })[];
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date | null;
            orderCode: string;
            customerId: bigint;
            branchId: bigint;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentId: bigint | null;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            paymentProofFile: string | null;
            paymentProofUploadedAt: Date | null;
            notes: string | null;
        };
    } & {
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByOrderId(orderId: bigint): import("@prisma/client").Prisma.Prisma__PaymentClient<({
        order: {
            customer: {
                id: bigint;
                email: string;
                phone: string | null;
                fullName: never;
            };
            branch: {
                name: string;
                id: bigint;
                phone: string | null;
                address: string | null;
            };
            orderItems: ({
                roomAndDevice: {
                    name: string;
                    id: bigint;
                    createdAt: Date;
                    updatedAt: Date | null;
                    branchId: bigint;
                    status: import("@prisma/client").$Enums.RoomAndDeviceStatus;
                    pricePerHour: import("@prisma/client-runtime-utils").Decimal;
                    categoryId: bigint | null;
                    deviceType: import("@prisma/client").$Enums.DeviceType;
                    version: import("@prisma/client").$Enums.DeviceVersion | null;
                    roomNumber: string | null;
                };
            } & {
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
            })[];
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date | null;
            orderCode: string;
            customerId: bigint;
            branchId: bigint;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentId: bigint | null;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            paymentProofFile: string | null;
            paymentProofUploadedAt: Date | null;
            notes: string | null;
        };
    } & {
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findMany(where: object, skip?: number, take?: number): import("@prisma/client").Prisma.PrismaPromise<({
        order: {
            customer: {
                id: bigint;
                email: string;
                phone: string | null;
                fullName: never;
            };
            branch: {
                name: string;
                id: bigint;
                phone: string | null;
                address: string | null;
            };
            orderItems: ({
                roomAndDevice: {
                    name: string;
                    id: bigint;
                    createdAt: Date;
                    updatedAt: Date | null;
                    branchId: bigint;
                    status: import("@prisma/client").$Enums.RoomAndDeviceStatus;
                    pricePerHour: import("@prisma/client-runtime-utils").Decimal;
                    categoryId: bigint | null;
                    deviceType: import("@prisma/client").$Enums.DeviceType;
                    version: import("@prisma/client").$Enums.DeviceVersion | null;
                    roomNumber: string | null;
                };
            } & {
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
            })[];
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date | null;
            orderCode: string;
            customerId: bigint;
            branchId: bigint;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentId: bigint | null;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            paymentProofFile: string | null;
            paymentProofUploadedAt: Date | null;
            notes: string | null;
        };
    } & {
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
    count(where: object): import("@prisma/client").Prisma.PrismaPromise<number>;
    findFirst(where: object): import("@prisma/client").Prisma.Prisma__PaymentClient<({
        order: {
            customer: {
                id: bigint;
                email: string;
                phone: string | null;
                fullName: never;
            };
            branch: {
                name: string;
                id: bigint;
                phone: string | null;
                address: string | null;
            };
            orderItems: ({
                roomAndDevice: {
                    name: string;
                    id: bigint;
                    createdAt: Date;
                    updatedAt: Date | null;
                    branchId: bigint;
                    status: import("@prisma/client").$Enums.RoomAndDeviceStatus;
                    pricePerHour: import("@prisma/client-runtime-utils").Decimal;
                    categoryId: bigint | null;
                    deviceType: import("@prisma/client").$Enums.DeviceType;
                    version: import("@prisma/client").$Enums.DeviceVersion | null;
                    roomNumber: string | null;
                };
            } & {
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
            })[];
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date | null;
            orderCode: string;
            customerId: bigint;
            branchId: bigint;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentId: bigint | null;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            paymentProofFile: string | null;
            paymentProofUploadedAt: Date | null;
            notes: string | null;
        };
    } & {
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(data: any): import("@prisma/client").Prisma.Prisma__PaymentClient<{
        order: {
            customer: {
                id: bigint;
                email: string;
                phone: string | null;
                fullName: never;
            };
            branch: {
                name: string;
                id: bigint;
                phone: string | null;
                address: string | null;
            };
            orderItems: ({
                roomAndDevice: {
                    name: string;
                    id: bigint;
                    createdAt: Date;
                    updatedAt: Date | null;
                    branchId: bigint;
                    status: import("@prisma/client").$Enums.RoomAndDeviceStatus;
                    pricePerHour: import("@prisma/client-runtime-utils").Decimal;
                    categoryId: bigint | null;
                    deviceType: import("@prisma/client").$Enums.DeviceType;
                    version: import("@prisma/client").$Enums.DeviceVersion | null;
                    roomNumber: string | null;
                };
            } & {
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
            })[];
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date | null;
            orderCode: string;
            customerId: bigint;
            branchId: bigint;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentId: bigint | null;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            paymentProofFile: string | null;
            paymentProofUploadedAt: Date | null;
            notes: string | null;
        };
    } & {
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(paymentId: bigint, data: any): import("@prisma/client").Prisma.Prisma__PaymentClient<{
        order: {
            customer: {
                id: bigint;
                email: string;
                phone: string | null;
                fullName: never;
            };
            branch: {
                name: string;
                id: bigint;
                phone: string | null;
                address: string | null;
            };
            orderItems: ({
                roomAndDevice: {
                    name: string;
                    id: bigint;
                    createdAt: Date;
                    updatedAt: Date | null;
                    branchId: bigint;
                    status: import("@prisma/client").$Enums.RoomAndDeviceStatus;
                    pricePerHour: import("@prisma/client-runtime-utils").Decimal;
                    categoryId: bigint | null;
                    deviceType: import("@prisma/client").$Enums.DeviceType;
                    version: import("@prisma/client").$Enums.DeviceVersion | null;
                    roomNumber: string | null;
                };
            } & {
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
            })[];
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date | null;
            orderCode: string;
            customerId: bigint;
            branchId: bigint;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentId: bigint | null;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            paymentProofFile: string | null;
            paymentProofUploadedAt: Date | null;
            notes: string | null;
        };
    } & {
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateStatus(paymentId: bigint, status: string): import("@prisma/client").Prisma.Prisma__PaymentClient<{
        order: {
            customer: {
                id: bigint;
                email: string;
                phone: string | null;
                fullName: never;
            };
            branch: {
                name: string;
                id: bigint;
                phone: string | null;
                address: string | null;
            };
            orderItems: ({
                roomAndDevice: {
                    name: string;
                    id: bigint;
                    createdAt: Date;
                    updatedAt: Date | null;
                    branchId: bigint;
                    status: import("@prisma/client").$Enums.RoomAndDeviceStatus;
                    pricePerHour: import("@prisma/client-runtime-utils").Decimal;
                    categoryId: bigint | null;
                    deviceType: import("@prisma/client").$Enums.DeviceType;
                    version: import("@prisma/client").$Enums.DeviceVersion | null;
                    roomNumber: string | null;
                };
            } & {
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
            })[];
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date | null;
            orderCode: string;
            customerId: bigint;
            branchId: bigint;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentId: bigint | null;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            paymentProofFile: string | null;
            paymentProofUploadedAt: Date | null;
            notes: string | null;
        };
    } & {
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(paymentId: bigint): import("@prisma/client").Prisma.Prisma__PaymentClient<{
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=paymentRepository.d.ts.map