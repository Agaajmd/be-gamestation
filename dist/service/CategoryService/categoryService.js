"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCategoryService = addCategoryService;
exports.getCategoriesService = getCategoriesService;
exports.updateCategoryService = updateCategoryService;
exports.deleteCategoryService = deleteCategoryService;
// Repository
const categoryRepository_1 = require("../../repository/categoryRepository");
const auditLogRepository_1 = require("../../repository/auditLogRepository");
// Helper
const checkBranchAccessHelper_1 = require("../../helper/checkBranchAccessHelper");
const branchAmenitiesHelper_1 = require("../../helper/branchAmenitiesHelper");
// Errors
const categoryError_1 = require("../../errors/CategoryError/categoryError");
const userError_1 = require("../../errors/UserError/userError");
// Service function to add category
async function addCategoryService(payload) {
    const { branchId, userId, name, description, tier, pricePerHour, amenities } = payload;
    // Check authorization
    const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
    if (!hasAccess) {
        throw new userError_1.HasNoAccessError();
    }
    // Check duplicate
    const existing = await categoryRepository_1.CategoryRepository.findByBranchNameAndTier(branchId, name, tier);
    if (existing) {
        throw new categoryError_1.CategoryAlreadyExistsError();
    }
    // Create category
    const category = await categoryRepository_1.CategoryRepository.create({
        branchId,
        name,
        description,
        tier,
        pricePerHour,
        amenities,
    });
    // Log audit
    await auditLogRepository_1.AuditLogRepository.createAuditLog({
        userId,
        action: "ADD_CATEGORY",
        entity: "Category",
        entityId: category.id,
        meta: {
            branchId: branchId.toString(),
            name,
            tier,
        },
    });
    // Auto-update branch amenities
    try {
        await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
    }
    catch (error) {
        console.error("Failed to update branch amenities:", error);
    }
    return category;
}
// Service function to get categories
async function getCategoriesService(payload) {
    const { branchId, deviceType, tier, isActive } = payload;
    const categories = await categoryRepository_1.CategoryRepository.findMany({
        branchId,
        deviceType,
        tier,
        isActive,
    });
    return categories;
}
// Service function to update category
async function updateCategoryService(payload) {
    const { branchId, categoryId, userId, data } = payload;
    // Check authorization
    const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
    if (!hasAccess) {
        throw new userError_1.HasNoAccessError();
    }
    // Check category exists
    const category = await categoryRepository_1.CategoryRepository.findById(categoryId);
    if (!category || category.branchId !== branchId) {
        throw new categoryError_1.CategoryNotFoundError();
    }
    // Update category
    const updated = await categoryRepository_1.CategoryRepository.update(categoryId, data);
    // Log audit
    await auditLogRepository_1.AuditLogRepository.createAuditLog({
        userId,
        action: "UPDATE_DEVICE_CATEGORY",
        entity: "DeviceCategory",
        entityId: categoryId,
        meta: {
            branchId: branchId.toString(),
            changes: data,
        },
    });
    // Auto-update branch amenities
    try {
        await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
    }
    catch (error) {
        console.error("Failed to update branch amenities:", error);
    }
    return updated;
}
// Service function to delete category
async function deleteCategoryService(payload) {
    const { branchId, categoryId, userId } = payload;
    // Check authorization
    const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
    if (!hasAccess) {
        throw new userError_1.HasNoAccessError();
    }
    // Check category exists
    const category = await categoryRepository_1.CategoryRepository.findByIdWithCount(categoryId);
    if (!category || category.branchId !== branchId) {
        throw new categoryError_1.CategoryNotFoundError();
    }
    // Check if devices are using this category
    if (category._count.roomAndDevices > 0) {
        throw new categoryError_1.CategoryHasDevicesError();
    }
    // Delete category
    await categoryRepository_1.CategoryRepository.delete(categoryId);
    // Log audit
    await auditLogRepository_1.AuditLogRepository.createAuditLog({
        userId,
        action: "DELETE_DEVICE_CATEGORY",
        entity: "DeviceCategory",
        entityId: categoryId,
        meta: {
            branchId: branchId.toString(),
            categoryName: category.name,
        },
    });
    // Auto-update branch amenities
    try {
        await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
    }
    catch (error) {
        console.error("Failed to update branch amenities:", error);
    }
    return category;
}
//# sourceMappingURL=categoryService.js.map