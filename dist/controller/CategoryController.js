"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeviceCategory = exports.updateCategory = exports.getCategories = exports.addCategory = void 0;
// Services
const categoryService_1 = require("../service/CategoryService/categoryService");
// Error
const responseHelper_1 = require("../helper/responseHelper");
/**
 * POST /branches/:id/category
 * Owner/admin menambahkan kategori order ke cabang
 */
const addCategory = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const userId = BigInt(req.user.userId);
        const { name, description, tier, pricePerHour, amenities } = req.body;
        const category = await (0, categoryService_1.addCategoryService)({
            branchId,
            userId,
            name,
            description,
            tier,
            pricePerHour,
            amenities,
        });
        res.status(201).json({
            success: true,
            message: "Kategori berhasil ditambahkan",
            data: category,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.addCategory = addCategory;
/**
 * GET /branches/:id/category
 * Mendapatkan semua kategori di cabang
 */
const getCategories = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const { deviceType, tier, isActive } = req.query;
        const categories = await (0, categoryService_1.getCategoriesService)({
            branchId,
            deviceType: deviceType,
            tier: tier,
            isActive: isActive ? isActive === "true" : undefined,
        });
        res.status(200).json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getCategories = getCategories;
/**
 * PUT /branches/:branchId/device-categories/:categoryId
 * Owner/admin mengupdate kategori device
 */
const updateCategory = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const categoryId = BigInt(req.params.categoryId);
        const userId = BigInt(req.user.userId);
        const updated = await (0, categoryService_1.updateCategoryService)({
            branchId,
            categoryId,
            userId,
            data: req.body,
        });
        res.status(200).json({
            success: true,
            message: "Kategori device berhasil diupdate",
            data: updated,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateCategory = updateCategory;
/**
 * DELETE /branches/:branchId/device-categories/:categoryId
 * Owner/admin menghapus kategori device
 */
const deleteDeviceCategory = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const categoryId = BigInt(req.params.categoryId);
        const userId = BigInt(req.user.userId);
        await (0, categoryService_1.deleteCategoryService)({
            branchId,
            categoryId,
            userId,
        });
        res.status(200).json({
            success: true,
            message: "Kategori device berhasil dihapus",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.deleteDeviceCategory = deleteDeviceCategory;
//# sourceMappingURL=CategoryController.js.map