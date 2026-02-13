import { PaymentMethod, PaymentProvider } from "@prisma/client";
export declare function addBranchPaymentMethodService(payload: {
    branchId: bigint;
    method: PaymentMethod;
    provider: PaymentProvider;
    isActive?: boolean;
    accountNumber?: string;
    accountName?: string;
    qrCodeImage?: string;
    instructions?: string;
}): Promise<{
    branch: {
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
    };
} & {
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
}>;
export declare function getBranchPaymentMethodsService(branchId: bigint): Promise<({
    branch: {
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
    };
} & {
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
})[]>;
export declare function getActiveBranchPaymentMethodsService(branchId: bigint): Promise<{
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
}[]>;
export declare function getBranchPaymentMethodByIdService(id: bigint): Promise<{
    branch: {
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
    };
} & {
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
}>;
export declare function updateBranchPaymentMethodService(payload: {
    id: bigint;
    method?: PaymentMethod;
    provider?: PaymentProvider;
    isActive?: boolean;
    accountNumber?: string | null;
    accountName?: string | null;
    qrCodeImage?: string | null;
    instructions?: string | null;
    displayOrder?: number;
}): Promise<{
    branch: {
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
    };
} & {
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
}>;
export declare function deleteBranchPaymentMethodService(id: bigint): Promise<void>;
export declare function toggleBranchPaymentMethodStatusService(id: bigint): Promise<{
    branch: {
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
    };
} & {
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
}>;
//# sourceMappingURL=branchPaymentMethodService.d.ts.map