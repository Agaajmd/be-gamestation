import { CategoryWithRoomAndDevice } from "./type/category/categoyWithRoomAndDevice.ts";
import { CategoryTier } from "@prisma/client";
export declare const CategoryRepository: {
    findAllByBranchIdWithRoomAndDevice(branchId: bigint): Promise<CategoryWithRoomAndDevice[]>;
    findById(categoryId: bigint): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        branchId: bigint;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
        description: string | null;
        tier: import("@prisma/client").$Enums.CategoryTier;
        pricePerHour: import("@prisma/client-runtime-utils").Decimal;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByIdWithCount(categoryId: bigint): import("@prisma/client").Prisma.Prisma__CategoryClient<({
        _count: {
            roomAndDevices: number;
        };
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByBranchNameAndTier(branchId: bigint, name: string, tier: CategoryTier): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        branchId: bigint;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
        description: string | null;
        tier: import("@prisma/client").$Enums.CategoryTier;
        pricePerHour: import("@prisma/client-runtime-utils").Decimal;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByBranchIdAndCategoryId(branchId: bigint, categoryId: bigint): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        branchId: bigint;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
        description: string | null;
        tier: import("@prisma/client").$Enums.CategoryTier;
        pricePerHour: import("@prisma/client-runtime-utils").Decimal;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findMany(filters: {
        branchId: bigint;
        deviceType?: string;
        tier?: CategoryTier;
        isActive?: boolean;
    }): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            roomAndDevices: number;
        };
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
    create(data: {
        branchId: bigint;
        name: string;
        description?: string;
        tier: CategoryTier;
        pricePerHour: number;
        amenities?: any;
    }): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        branchId: bigint;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
        description: string | null;
        tier: import("@prisma/client").$Enums.CategoryTier;
        pricePerHour: import("@prisma/client-runtime-utils").Decimal;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(categoryId: bigint, data: any): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        branchId: bigint;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
        description: string | null;
        tier: import("@prisma/client").$Enums.CategoryTier;
        pricePerHour: import("@prisma/client-runtime-utils").Decimal;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(categoryId: bigint): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        branchId: bigint;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
        description: string | null;
        tier: import("@prisma/client").$Enums.CategoryTier;
        pricePerHour: import("@prisma/client-runtime-utils").Decimal;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=categoryRepository.d.ts.map