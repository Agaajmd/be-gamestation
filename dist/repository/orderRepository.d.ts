import { OrderStatus, PaymentStatus } from "@prisma/client";
export declare const OrderRepository: {
    findUnique(where: any): import("@prisma/client").Prisma.Prisma__OrderClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(orderId: bigint): import("@prisma/client").Prisma.Prisma__OrderClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByOrderCode(orderCode: string): import("@prisma/client").Prisma.Prisma__OrderClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findFirst(where: object, options?: object): import("@prisma/client").Prisma.Prisma__OrderClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findMany(where: object, skip?: number, take?: number): import("@prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    findByCustomerId(customerId: bigint, skip?: number, take?: number): import("@prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    findByBranchId(branchId: bigint, skip?: number, take?: number): import("@prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    count(where: object): import("@prisma/client").Prisma.PrismaPromise<number>;
    create(data: any): import("@prisma/client").Prisma.Prisma__OrderClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(orderId: bigint, data: any): import("@prisma/client").Prisma.Prisma__OrderClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateStatus(orderId: bigint, status: OrderStatus, paymentStatus?: PaymentStatus): import("@prisma/client").Prisma.Prisma__OrderClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(orderId: bigint): import("@prisma/client").Prisma.Prisma__OrderClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findFirstSimple(where: object): Promise<{
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
    } | null>;
    getCartOrder(customerId: bigint, branchId?: bigint): import("@prisma/client").Prisma.Prisma__OrderClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=orderRepository.d.ts.map