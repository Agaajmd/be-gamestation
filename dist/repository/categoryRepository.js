"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const database_1 = require("../database");
// Type
const categoyWithRoomAndDevice_ts_1 = require("./type/category/categoyWithRoomAndDevice.ts");
exports.CategoryRepository = {
    // Find all categories by branch ID with room and device
    findAllByBranchIdWithRoomAndDevice(branchId) {
        return database_1.prisma.category.findMany({
            where: {
                branchId: branchId,
            },
            ...categoyWithRoomAndDevice_ts_1.CategoryWithRoomAndDeviceConfig,
        });
    },
    // Find category by ID
    findById(categoryId) {
        return database_1.prisma.category.findUnique({
            where: { id: categoryId },
        });
    },
    // Find category by ID with count
    findByIdWithCount(categoryId) {
        return database_1.prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                _count: {
                    select: {
                        roomAndDevices: true,
                    },
                },
            },
        });
    },
    // Find by branch, name and tier
    findByBranchNameAndTier(branchId, name, tier) {
        return database_1.prisma.category.findUnique({
            where: {
                branchId_name_tier: {
                    branchId,
                    name,
                    tier,
                },
            },
        });
    },
    // Find by branch ID and category ID
    findByBranchIdAndCategoryId(branchId, categoryId) {
        return database_1.prisma.category.findFirst({
            where: { branchId, id: categoryId },
        });
    },
    // Find many with filters
    findMany(filters) {
        return database_1.prisma.category.findMany({
            where: {
                branchId: filters.branchId,
                ...(filters.deviceType && { deviceType: filters.deviceType }),
                ...(filters.tier && { tier: filters.tier }),
                ...(filters.isActive !== undefined && { isActive: filters.isActive }),
            },
            include: {
                _count: {
                    select: {
                        roomAndDevices: true,
                    },
                },
            },
            orderBy: [{ tier: "asc" }, { name: "asc" }],
        });
    },
    // Create category
    create(data) {
        return database_1.prisma.category.create({
            data,
        });
    },
    // Update category
    update(categoryId, data) {
        return database_1.prisma.category.update({
            where: { id: categoryId },
            data,
        });
    },
    // Delete category
    delete(categoryId) {
        return database_1.prisma.category.delete({
            where: { id: categoryId },
        });
    },
};
//# sourceMappingURL=categoryRepository.js.map