import { CategoryTier } from "@prisma/client";
interface AddCategoryPayload {
    branchId: bigint;
    userId: bigint;
    name: string;
    description?: string;
    tier: CategoryTier;
    pricePerHour: number;
    amenities?: any;
}
interface GetCategoriesPayload {
    branchId: bigint;
    deviceType?: string;
    tier?: CategoryTier;
    isActive?: boolean;
}
interface UpdateCategoryPayload {
    branchId: bigint;
    categoryId: bigint;
    userId: bigint;
    data: any;
}
interface DeleteCategoryPayload {
    branchId: bigint;
    categoryId: bigint;
    userId: bigint;
}
export declare function addCategoryService(payload: AddCategoryPayload): Promise<{
    name: string;
    id: bigint;
    createdAt: Date;
    updatedAt: Date | null;
    branchId: bigint;
    amenities: import("@prisma/client/runtime/client").JsonValue | null;
    description: string | null;
    tier: import("@prisma/client").$Enums.CategoryTier;
    pricePerHour: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare function getCategoriesService(payload: GetCategoriesPayload): Promise<({
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
export declare function updateCategoryService(payload: UpdateCategoryPayload): Promise<{
    name: string;
    id: bigint;
    createdAt: Date;
    updatedAt: Date | null;
    branchId: bigint;
    amenities: import("@prisma/client/runtime/client").JsonValue | null;
    description: string | null;
    tier: import("@prisma/client").$Enums.CategoryTier;
    pricePerHour: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare function deleteCategoryService(payload: DeleteCategoryPayload): Promise<{
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
}>;
export {};
//# sourceMappingURL=categoryService.d.ts.map