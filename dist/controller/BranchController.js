"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranch = exports.updateBranch = exports.getBranchById = exports.getBranches = exports.createBranch = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const timeHelper_1 = require("../helper/timeHelper");
const branchAmenitiesHelper_1 = require("../helper/branchAmenitiesHelper");
/**
 * Helper function to serialize branch data with formatted times
 */
const serializeBranch = (branch) => {
    return {
        ...branch,
        id: branch.id?.toString(),
        ownerId: branch.ownerId?.toString(),
        openTime: (0, timeHelper_1.formatTime)(branch.openTime),
        closeTime: (0, timeHelper_1.formatTime)(branch.closeTime),
    };
};
/**
 * POST /branches
 * Owner membuat cabang baru
 * Required: Owner profile must exist
 */
const createBranch = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const { name, address, phone, timezone, openTime, closeTime, facilities } = req.body;
        // Cek apakah user adalah owner
        const owner = await prisma_1.default.owner.findUnique({
            where: { userId },
        });
        if (!owner) {
            res.status(403).json({
                success: false,
                message: "Anda harus menjadi owner untuk membuat cabang",
            });
            return;
        }
        // Validasi input
        if (!name) {
            res.status(400).json({
                success: false,
                message: "Nama cabang wajib diisi",
            });
            return;
        }
        // Parse time jika ada (format: "HH:MM:SS" atau "HH:MM")
        let parsedOpenTime;
        let parsedCloseTime;
        if (openTime) {
            parsedOpenTime = new Date(`1970-01-01T${openTime}Z`);
        }
        if (closeTime) {
            parsedCloseTime = new Date(`1970-01-01T${closeTime}Z`);
        }
        // Initialize amenities structure
        const initialAmenities = {
            auto: {
                roomAndDevices: { types: [], versions: [], total: 0 },
                categories: { tiers: [], names: [], total: 0 },
            },
            facilities: facilities || {
                general: [],
                foodAndBeverage: [],
                parking: [],
                entertainment: [],
                accessibility: [],
            },
            lastUpdated: new Date().toISOString(),
        };
        // Buat cabang baru
        const branch = await prisma_1.default.branch.create({
            data: {
                ownerId: owner.id,
                name,
                address,
                phone,
                timezone: timezone || "Asia/Jakarta",
                openTime: parsedOpenTime,
                closeTime: parsedCloseTime,
                amenities: initialAmenities,
            },
        });
        // Log audit
        await prisma_1.default.auditLog.create({
            data: {
                userId,
                action: "CREATE_BRANCH",
                entity: "Branch",
                entityId: branch.id,
                meta: {
                    branchName: name,
                    timestamp: new Date().toISOString(),
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "Cabang berhasil dibuat",
            data: serializeBranch(branch),
        });
    }
    catch (error) {
        console.error("Create branch error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat membuat cabang",
        });
    }
};
exports.createBranch = createBranch;
/**
 * GET /branches
 * Get list cabang (owner melihat cabang miliknya, admin melihat cabang yang dia kelola)
 */
const getBranches = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const userRole = req.user.role;
        let branches;
        if (userRole === "owner") {
            // Owner bisa lihat semua cabang
            branches = await prisma_1.default.branch.findMany({
                include: {
                    owner: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                    fullname: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            roomAndDevices: true,
                            orders: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        else if (userRole === "admin") {
            // Admin hanya bisa lihat cabang yang dia kelola
            const admin = await prisma_1.default.admin.findUnique({
                where: { userId },
                include: { branch: true },
            });
            branches = admin ? [admin.branch] : [];
        }
        else {
            // Customer melihat semua cabang yang tersedia (untuk pilihan saat order)
            branches = await prisma_1.default.branch.findMany({
                select: {
                    id: true,
                    name: true,
                    address: true,
                    phone: true,
                    timezone: true,
                    openTime: true,
                    closeTime: true,
                    amenities: true,
                    _count: {
                        select: {
                            roomAndDevices: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        // Serialize branches with proper time formatting
        const serializedBranches = Array.isArray(branches)
            ? branches.map((branch) => ({
                ...serializeBranch(branch),
                owner: branch.owner
                    ? {
                        ...branch.owner,
                        id: branch.owner.id?.toString(),
                        userId: branch.owner.userId?.toString(),
                    }
                    : undefined,
            }))
            : [];
        res.status(200).json({
            success: true,
            data: serializedBranches,
        });
    }
    catch (error) {
        console.error("Get branches error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data cabang",
        });
    }
};
exports.getBranches = getBranches;
/**
 * GET /branches/:id
 * Get detail cabang
 */
const getBranchById = async (req, res) => {
    try {
        const branchId = BigInt(req.params.id);
        const userId = BigInt(req.user.userId);
        const userRole = req.user.role;
        const branch = await prisma_1.default.branch.findUnique({
            where: { id: branchId },
            include: {
                owner: {
                    include: {
                        user: {
                            select: {
                                fullname: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
                roomAndDevices: {
                    orderBy: { roomNumber: "asc" },
                },
                admins: {
                    include: {
                        user: {
                            select: {
                                fullname: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });
        if (!branch) {
            res.status(404).json({
                success: false,
                message: "Cabang tidak ditemukan",
            });
            return;
        }
        // Cek authorization
        if (userRole === "admin") {
            const admin = await prisma_1.default.admin.findUnique({
                where: { userId },
            });
            if (!admin || admin.branchId !== branchId) {
                res.status(403).json({
                    success: false,
                    message: "Anda tidak memiliki akses ke cabang ini",
                });
                return;
            }
        }
        else if (userRole === "customer") {
            const owner = await prisma_1.default.owner.findUnique({
                where: { userId },
            });
            if (!owner || branch.ownerId !== owner.id) {
                res.status(403).json({
                    success: false,
                    message: "Anda tidak memiliki akses ke cabang ini",
                });
                return;
            }
        }
        // Serialize branch with proper formatting
        const serializedBranch = {
            ...serializeBranch(branch),
            owner: branch.owner
                ? {
                    ...branch.owner,
                    id: branch.owner.id?.toString(),
                    userId: branch.owner.userId?.toString(),
                }
                : undefined,
            roomAndDevices: branch.roomAndDevices?.map((device) => ({
                ...device,
                id: device.id?.toString(),
                branchId: device.branchId?.toString(),
            })),
            admins: branch.admins?.map((admin) => ({
                ...admin,
                id: admin.id?.toString(),
                userId: admin.userId?.toString(),
                branchId: admin.branchId?.toString(),
            })),
        };
        res.status(200).json({
            success: true,
            data: serializedBranch,
        });
    }
    catch (error) {
        console.error("Get branch detail error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil detail cabang",
        });
    }
};
exports.getBranchById = getBranchById;
/**
 * PUT /branches/:id
 * Update cabang (hanya owner)
 */
const updateBranch = async (req, res) => {
    try {
        const branchId = BigInt(req.params.id);
        const userId = BigInt(req.user.userId);
        const { name, address, phone, timezone, openTime, closeTime, facilities } = req.body;
        // Cek cabang exist
        const branch = await prisma_1.default.branch.findUnique({
            where: { id: branchId },
        });
        if (!branch) {
            res.status(404).json({
                success: false,
                message: "Cabang tidak ditemukan",
            });
            return;
        }
        // Cek authorization - hanya owner yang bisa update
        const owner = await prisma_1.default.owner.findUnique({
            where: { userId },
        });
        if (!owner || branch.ownerId !== owner.id) {
            res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses untuk mengupdate cabang ini",
            });
            return;
        }
        // Parse time jika ada
        let parsedOpenTime;
        let parsedCloseTime;
        if (openTime) {
            parsedOpenTime = new Date(`1970-01-01T${openTime}Z`);
        }
        if (closeTime) {
            parsedCloseTime = new Date(`1970-01-01T${closeTime}Z`);
        }
        // Update facilities if provided
        if (facilities !== undefined) {
            await (0, branchAmenitiesHelper_1.updateBranchFacilities)(branchId, facilities);
        }
        // Update branch
        const updatedBranch = await prisma_1.default.branch.update({
            where: { id: branchId },
            data: {
                name: name || branch.name,
                address: address !== undefined ? address : branch.address,
                phone: phone !== undefined ? phone : branch.phone,
                timezone: timezone || branch.timezone,
                openTime: parsedOpenTime !== undefined ? parsedOpenTime : branch.openTime,
                closeTime: parsedCloseTime !== undefined ? parsedCloseTime : branch.closeTime,
            },
        });
        // Log audit
        await prisma_1.default.auditLog.create({
            data: {
                userId,
                action: "UPDATE_BRANCH",
                entity: "Branch",
                entityId: branchId,
                meta: {
                    changes: req.body,
                    timestamp: new Date().toISOString(),
                },
            },
        });
        // Serialize updated branch
        res.status(200).json({
            success: true,
            message: "Cabang berhasil diupdate",
            data: serializeBranch(updatedBranch),
        });
    }
    catch (error) {
        console.error("Update branch error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengupdate cabang",
        });
    }
};
exports.updateBranch = updateBranch;
/**
 * DELETE /branches/:id
 * Delete cabang (hanya owner)
 */
const deleteBranch = async (req, res) => {
    try {
        const branchId = BigInt(req.params.id);
        const userId = BigInt(req.user.userId);
        // Cek cabang exist
        const branch = await prisma_1.default.branch.findUnique({
            where: { id: branchId },
            include: {
                _count: {
                    select: {
                        roomAndDevices: true,
                        orders: true,
                    },
                },
            },
        });
        if (!branch) {
            res.status(404).json({
                success: false,
                message: "Cabang tidak ditemukan",
            });
            return;
        }
        // Cek authorization
        const owner = await prisma_1.default.owner.findUnique({
            where: { userId },
        });
        if (!owner || branch.ownerId !== owner.id) {
            res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses untuk menghapus cabang ini",
            });
            return;
        }
        // Cek apakah ada order aktif
        if (branch._count.orders > 0) {
            res.status(400).json({
                success: false,
                message: "Tidak dapat menghapus cabang yang memiliki riwayat order. Silakan hubungi super admin.",
            });
            return;
        }
        // Delete branch (cascade akan menghapus devices, admins)
        await prisma_1.default.branch.delete({
            where: { id: branchId },
        });
        // Log audit
        await prisma_1.default.auditLog.create({
            data: {
                userId,
                action: "DELETE_BRANCH",
                entity: "Branch",
                entityId: branchId,
                meta: {
                    branchName: branch.name,
                    timestamp: new Date().toISOString(),
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "Cabang berhasil dihapus",
        });
    }
    catch (error) {
        console.error("Delete branch error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus cabang",
        });
    }
};
exports.deleteBranch = deleteBranch;
//# sourceMappingURL=BranchController.js.map