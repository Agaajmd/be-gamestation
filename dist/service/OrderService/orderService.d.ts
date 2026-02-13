import { OrderStatus, PaymentStatus } from "@prisma/client";
/**
 * Calculate booking price using booking flow calculation
 */
export declare const calculateBookingPriceService: (branchId: bigint, deviceId: bigint, categoryId: bigint, bookingDate: string, durationMinutes: number) => Promise<{
    baseAmount: number;
    categoryFee: number;
    advanceBookingFee: number;
    totalAmount: number;
}>;
/**
 * Add to cart - Create new order with cart status
 */
export declare const addToCartService: (payload: {
    userId: bigint;
    branchId: bigint;
    bookingDate: string;
    startTime: string;
    durationMinutes: number;
    categoryId: bigint;
    roomAndDeviceId: bigint;
    notes?: string;
}) => Promise<{
    customer: {
        id: bigint;
        email: string;
        fullname: string;
        phone: string | null;
    };
    branch: {
        name: string;
        id: bigint;
        phone: string | null;
        address: string | null;
    };
    payment: {
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    } | null;
    session: {
        id: bigint;
        status: import("@prisma/client").$Enums.SessionStatus;
        roomAndDeviceId: bigint;
        orderId: bigint;
        startedAt: Date;
        endedAt: Date | null;
    } | null;
    orderItems: ({
        roomAndDevice: {
            category: {
                name: string;
                id: bigint;
                createdAt: Date;
                updatedAt: Date | null;
                branchId: bigint;
                amenities: import("@prisma/client/runtime/client").JsonValue | null;
                description: string | null;
                tier: import("@prisma/client").$Enums.CategoryTier;
                pricePerHour: import("@prisma/client-runtime-utils").Decimal;
            } | null;
        } & {
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
}>;
/**
 * Checkout order - Convert cart to pending status
 */
export declare const checkoutOrderService: (payload: {
    userId: bigint;
    orderId: bigint;
    paymentId: bigint;
    paymentProofFile?: Express.Multer.File;
}) => Promise<{
    customer: {
        id: bigint;
        email: string;
        fullname: string;
        phone: string | null;
    };
    branch: {
        name: string;
        id: bigint;
        phone: string | null;
        address: string | null;
    };
    payment: {
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    } | null;
    session: {
        id: bigint;
        status: import("@prisma/client").$Enums.SessionStatus;
        roomAndDeviceId: bigint;
        orderId: bigint;
        startedAt: Date;
        endedAt: Date | null;
    } | null;
    orderItems: ({
        roomAndDevice: {
            category: {
                name: string;
                id: bigint;
                createdAt: Date;
                updatedAt: Date | null;
                branchId: bigint;
                amenities: import("@prisma/client/runtime/client").JsonValue | null;
                description: string | null;
                tier: import("@prisma/client").$Enums.CategoryTier;
                pricePerHour: import("@prisma/client-runtime-utils").Decimal;
            } | null;
        } & {
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
}>;
/**
 * Get orders - Role-based filtering
 */
export declare const getOrdersService: (payload: {
    userId: bigint;
    role: string;
    branchId?: bigint;
    status?: string;
    skip?: number;
    take?: number;
}) => Promise<{
    orders: ({
        customer: {
            id: bigint;
            email: string;
            fullname: string;
            phone: string | null;
        };
        branch: {
            name: string;
            id: bigint;
            phone: string | null;
            address: string | null;
        };
        payment: {
            id: bigint;
            status: import("@prisma/client").$Enums.PaymentProviderStatus;
            method: import("@prisma/client").$Enums.PaymentMethod;
            provider: string | null;
            orderId: bigint;
            amount: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string | null;
            paidAt: Date | null;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
        } | null;
        session: {
            id: bigint;
            status: import("@prisma/client").$Enums.SessionStatus;
            roomAndDeviceId: bigint;
            orderId: bigint;
            startedAt: Date;
            endedAt: Date | null;
        } | null;
        orderItems: ({
            roomAndDevice: {
                category: {
                    name: string;
                    id: bigint;
                    createdAt: Date;
                    updatedAt: Date | null;
                    branchId: bigint;
                    amenities: import("@prisma/client/runtime/client").JsonValue | null;
                    description: string | null;
                    tier: import("@prisma/client").$Enums.CategoryTier;
                    pricePerHour: import("@prisma/client-runtime-utils").Decimal;
                } | null;
            } & {
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
    })[];
    total: number;
}>;
/**
 * Get order by ID - Role-based access control
 */
export declare const getOrderByIdService: (payload: {
    userId: bigint;
    orderId: bigint;
    role: string;
    branchId?: bigint;
}) => Promise<{
    customer: {
        id: bigint;
        email: string;
        fullname: string;
        phone: string | null;
    };
    branch: {
        name: string;
        id: bigint;
        phone: string | null;
        address: string | null;
    };
    payment: {
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    } | null;
    session: {
        id: bigint;
        status: import("@prisma/client").$Enums.SessionStatus;
        roomAndDeviceId: bigint;
        orderId: bigint;
        startedAt: Date;
        endedAt: Date | null;
    } | null;
    orderItems: ({
        roomAndDevice: {
            category: {
                name: string;
                id: bigint;
                createdAt: Date;
                updatedAt: Date | null;
                branchId: bigint;
                amenities: import("@prisma/client/runtime/client").JsonValue | null;
                description: string | null;
                tier: import("@prisma/client").$Enums.CategoryTier;
                pricePerHour: import("@prisma/client-runtime-utils").Decimal;
            } | null;
        } & {
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
}>;
/**
 * Update order status - Admin/owner only, with proper status transitions
 */
export declare const updateOrderStatusService: (payload: {
    userId: bigint;
    orderId: bigint;
    newStatus: OrderStatus;
    newPaymentStatus?: PaymentStatus;
    branchId: bigint;
}) => Promise<{
    customer: {
        id: bigint;
        email: string;
        fullname: string;
        phone: string | null;
    };
    branch: {
        name: string;
        id: bigint;
        phone: string | null;
        address: string | null;
    };
    payment: {
        id: bigint;
        status: import("@prisma/client").$Enums.PaymentProviderStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: string | null;
        orderId: bigint;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        paidAt: Date | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    } | null;
    session: {
        id: bigint;
        status: import("@prisma/client").$Enums.SessionStatus;
        roomAndDeviceId: bigint;
        orderId: bigint;
        startedAt: Date;
        endedAt: Date | null;
    } | null;
    orderItems: ({
        roomAndDevice: {
            category: {
                name: string;
                id: bigint;
                createdAt: Date;
                updatedAt: Date | null;
                branchId: bigint;
                amenities: import("@prisma/client/runtime/client").JsonValue | null;
                description: string | null;
                tier: import("@prisma/client").$Enums.CategoryTier;
                pricePerHour: import("@prisma/client-runtime-utils").Decimal;
            } | null;
        } & {
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
}>;
/**
 * Cancel order - Admin/owner only, only if payment is invalid
 */
export declare const cancelOrderService: (payload: {
    userId: bigint;
    orderId: bigint;
    branchId: bigint;
    reason?: string;
}) => Promise<{
    orderItems: {
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
    }[];
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
}>;
/**
 * Remove item from cart - Customer only
 */
export declare const removeItemFromCartService: (payload: {
    userId: bigint;
    orderItemId: bigint;
}) => Promise<{
    userId: bigint;
    orderItemId: bigint;
    orderDeleted: boolean;
    updatedTotal: number;
}>;
//# sourceMappingURL=orderService.d.ts.map