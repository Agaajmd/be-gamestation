"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeviceCategory = exports.updateCategory = exports.getCategories = exports.addCategory = void 0;
const checkBranchAccessHelper_1 = require("../helper/checkBranchAccessHelper");
const prisma_1 = __importDefault(require("../lib/prisma"));
const branchAmenitiesHelper_1 = require("../helper/branchAmenitiesHelper");
/**
 * POST /branches/:id/category
 * Owner/admin menambahkan kategori order ke cabang
 */
const addCategory = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const userId = BigInt(req.user.userId);
        const { name, description, tier, pricePerHour, amenities } = req.body;
        // Cek authorization
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
        if (!hasAccess) {
            res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke cabang ini",
            });
            return;
        }
        // Cek duplicate
        const existing = await prisma_1.default.category.findFirst({
            where: {
                branchId,
                name,
                tier,
            },
        });
        if (existing) {
            res.status(400).json({
                success: false,
                message: "Kategori dengan nama dan tier yang sama sudah ada",
            });
            return;
        }
        // Buat kategori
        const category = await prisma_1.default.category.create({
            data: {
                branchId,
                name,
                description,
                tier,
                pricePerHour,
                amenities,
            },
        });
        // Log audit
        await prisma_1.default.auditLog.create({
            data: {
                userId,
                action: "ADD_CATEGORY",
                entity: "Category",
                entityId: category.id,
                meta: {
                    branchId: branchId.toString(),
                    name,
                    tier,
                },
            },
        });
        // Auto-update branch amenities
        try {
            await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
        }
        catch (error) {
            console.error("Failed to update branch amenities:", error);
        }
        const serialized = JSON.parse(JSON.stringify(category, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(201).json({
            success: true,
            message: "Kategori berhasil ditambahkan",
            data: serialized,
        });
    }
    catch (error) {
        console.error("Add category error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menambahkan kategori",
        });
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
        const where = { branchId };
        if (deviceType) {
            where.deviceType = deviceType;
        }
        if (tier) {
            where.tier = tier;
        }
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }
        const categories = await prisma_1.default.category.findMany({
            where,
            include: {
                _count: {
                    select: {
                        roomAndDevices: true,
                    },
                },
            },
            orderBy: [{ tier: "asc" }, { name: "asc" }],
        });
        const serialized = JSON.parse(JSON.stringify(categories, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            data: serialized,
        });
    }
    catch (error) {
        console.error("Get device categories error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil kategori device",
        });
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
        // Cek authorization
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
        if (!hasAccess) {
            res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke cabang ini",
            });
            return;
        }
        // Cek kategori exist
        const category = await prisma_1.default.category.findUnique({
            where: { id: categoryId },
        });
        if (!category || category.branchId !== branchId) {
            res.status(404).json({
                success: false,
                message: "Kategori tidak ditemukan di cabang ini",
            });
            return;
        }
        // Update
        const updated = await prisma_1.default.category.update({
            where: { id: categoryId },
            data: req.body,
        });
        // Log audit
        await prisma_1.default.auditLog.create({
            data: {
                userId,
                action: "UPDATE_DEVICE_CATEGORY",
                entity: "DeviceCategory",
                entityId: categoryId,
                meta: {
                    branchId: branchId.toString(),
                    changes: req.body,
                },
            },
        });
        // Auto-update branch amenities
        try {
            await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
        }
        catch (error) {
            console.error("Failed to update branch amenities:", error);
        }
        const serialized = JSON.parse(JSON.stringify(updated, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            message: "Kategori device berhasil diupdate",
            data: serialized,
        });
    }
    catch (error) {
        console.error("Update device category error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengupdate kategori device",
        });
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
        // Cek authorization
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
        if (!hasAccess) {
            res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke cabang ini",
            });
            return;
        }
        // Cek kategori exist
        const category = await prisma_1.default.category.findUnique({
            where: { id: categoryId },
            include: {
                _count: {
                    select: {
                        roomAndDevices: true,
                    },
                },
            },
        });
        if (!category || category.branchId !== branchId) {
            res.status(404).json({
                success: false,
                message: "Kategori tidak ditemukan di cabang ini",
            });
            return;
        }
        // Cek apakah ada device yang menggunakan kategori ini
        if (category._count.roomAndDevices > 0) {
            res.status(400).json({
                success: false,
                message: "Tidak dapat menghapus kategori yang masih digunakan oleh device",
            });
            return;
        }
        // Delete
        await prisma_1.default.category.delete({
            where: { id: categoryId },
        });
        // Log audit
        await prisma_1.default.auditLog.create({
            data: {
                userId,
                action: "DELETE_DEVICE_CATEGORY",
                entity: "DeviceCategory",
                entityId: categoryId,
                meta: {
                    branchId: branchId.toString(),
                    categoryName: category.name,
                },
            },
        });
        // Auto-update branch amenities
        try {
            await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
        }
        catch (error) {
            console.error("Failed to update branch amenities:", error);
        }
        res.status(200).json({
            success: true,
            message: "Kategori device berhasil dihapus",
        });
    }
    catch (error) {
        console.error("Delete device category error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus kategori device",
        });
    }
};
exports.deleteDeviceCategory = deleteDeviceCategory;
//# sourceMappingURL=CategoryController.js.map