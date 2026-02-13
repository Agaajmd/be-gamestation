import { PaymentMethod, PaymentProvider } from "@prisma/client";
export declare const BranchPaymentMethodRepository: {
    findFirst(where: object, options?: object): import("@prisma/client").Prisma.Prisma__BranchPaymentMethodClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(id: bigint): import("@prisma/client").Prisma.Prisma__BranchPaymentMethodClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByBranchId(branchId: bigint): import("@prisma/client").Prisma.PrismaPromise<({
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
    findActiveByBranchId(branchId: bigint): import("@prisma/client").Prisma.PrismaPromise<{
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
    findByBranchIdAndProvider(branchId: bigint, provider: PaymentProvider): import("@prisma/client").Prisma.Prisma__BranchPaymentMethodClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
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
    create(data: {
        branchId: bigint;
        method: PaymentMethod;
        provider: PaymentProvider;
        isActive?: boolean;
        accountNumber?: string;
        accountName?: string;
        qrCodeImage?: string;
        instructions?: string;
    }): import("@prisma/client").Prisma.Prisma__BranchPaymentMethodClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: bigint, data: {
        method?: PaymentMethod;
        provider?: PaymentProvider;
        isActive?: boolean;
        accountNumber?: string | null;
        accountName?: string | null;
        qrCodeImage?: string | null;
        instructions?: string | null;
        displayOrder?: number;
    }): import("@prisma/client").Prisma.Prisma__BranchPaymentMethodClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(id: bigint): import("@prisma/client").Prisma.Prisma__BranchPaymentMethodClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    exists(id: bigint): import("@prisma/client").Prisma.Prisma__BranchPaymentMethodClient<{
        id: bigint;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=branchPaymentMethodRepository.d.ts.map