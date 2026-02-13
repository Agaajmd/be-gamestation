/**
 * Create payment (customer/admin/owner)
 */
export declare const createPaymentService: (payload: {
    userId: bigint;
    role: string;
    orderId: bigint;
    amount: number;
    method: string;
    provider?: string;
    transactionId?: string;
    metadata?: any;
}) => Promise<{
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
}>;
/**
 * Get payments (role-based filtering)
 */
export declare const getPaymentsService: (payload: {
    userId: bigint;
    role: string;
    status?: string;
    branchId?: bigint;
    skip?: number;
    take?: number;
}) => Promise<{
    payments: ({
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
    })[];
    total: number;
}>;
/**
 * Get payment by ID (role-based access control)
 */
export declare const getPaymentByIdService: (payload: {
    userId: bigint;
    role: string;
    paymentId: bigint;
}) => Promise<{
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
}>;
/**
 * Update payment status (admin/owner only)
 */
export declare const updatePaymentStatusService: (payload: {
    userId: bigint;
    role: string;
    paymentId: bigint;
    status: string;
    transactionId?: string;
    paidAt?: string;
    metadata?: any;
}) => Promise<{
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
}>;
/**
 * Delete payment (admin/owner only)
 */
export declare const deletePaymentService: (payload: {
    userId: bigint;
    role: string;
    paymentId: bigint;
}) => Promise<{
    success: boolean;
}>;
//# sourceMappingURL=paymentService.d.ts.map