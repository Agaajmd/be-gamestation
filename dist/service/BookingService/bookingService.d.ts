import { GetAvailableTimesResult } from "./type/getAvailableTimesResult";
export declare function getBranchesService(userId: bigint): Promise<{
    name: string;
    id: bigint;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    ownerId: bigint;
    address: string | null;
    timezone: string;
    openTime: Date | null;
    closeTime: Date | null;
    amenities: import("@prisma/client/runtime/client").JsonValue | null;
}[]>;
export declare function getAvailableDatesService(branchId: bigint, startDate: Date, endDate: Date): Promise<{
    availableDates: string[];
    fullyBookedDates: string[];
    closedDates: string[];
    openHour: number;
    closeHour: number;
    totalDevices: number;
}>;
export declare function getAvailableTimesService(branchId: bigint, date: Date): Promise<GetAvailableTimesResult>;
export declare function getDurationOptionsService(branchId: bigint, bookingDate: string, startHour: number, startMinute: number): Promise<{
    durationOptions: import("../../helper/generateDurationOptions").DurationOption[];
    closeTime: Date | null;
    maxDurationMinutes: number;
}>;
export declare function getAvailableCategoriesService(branchId: bigint): Promise<({
    roomAndDevices: {
        id: bigint;
        deviceType: import("@prisma/client").$Enums.DeviceType;
        version: import("@prisma/client").$Enums.DeviceVersion | null;
    }[];
} & {
    name: string;
    id: bigint;
    createdAt: Date;
    updatedAt: Date | null;
    branchId: bigint;
    amenities: import("@prisma/client/runtime/client").JsonValue | null;
    description: string | null;
    tier: import("@prisma/client").$Enums.CategoryTier;
    pricePerHour: import("@prisma/client-runtime-utils").Decimal;
})[]>;
export declare function getAvailableRoomAndDeviceService(branchId: bigint, categoryId: bigint, bookingDate: string, startHour: number, startMinute: number, durationMinutes: number): Promise<{
    id: string;
    roomNumber: string | null;
    name: string;
    type: import("@prisma/client").$Enums.DeviceType;
    version: import("@prisma/client").$Enums.DeviceVersion | null;
    pricePerHour: string;
    categoryName: string | undefined;
    categoryTier: import("@prisma/client").$Enums.CategoryTier | undefined;
}[]>;
export declare function getBookingCartService(userId: bigint): Promise<{
    order: {
        customer: {
            email: string;
            fullname: string;
            phone: string | null;
        };
        branch: {
            name: string;
        };
        orderItems: ({
            roomAndDevice: {
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
    totalItems: number;
    totalAmount: number;
    paymentMethods: {
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        branchId: bigint;
        method: import("@prisma/client").$Enums.PaymentMethod;
        provider: import("@prisma/client").$Enums.PaymentProvider;
        isActive: boolean;
        accountNumber: string | null;
        accountName: string | null;
        qrCodeImage: string | null;
        instructions: string | null;
    }[];
}>;
export declare function validateBranchForOrderService(userId: bigint, requestedBranchId: bigint): Promise<boolean>;
//# sourceMappingURL=bookingService.d.ts.map