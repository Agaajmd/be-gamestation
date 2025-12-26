"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoomAndDevice = exports.updateRoomAndDevice = exports.getRoomAndDeviceDetails = exports.getRoomsAndDevices = exports.addRoomAndDevice = void 0;
const checkBranchAccessHelper_1 = require("../helper/checkBranchAccessHelper");
const prisma_1 = __importDefault(require("../lib/prisma"));
const branchAmenitiesHelper_1 = require("../helper/branchAmenitiesHelper");
/**
 * POST /branches/:id/rooms-and-devices
 * Owner/staff menambahkan room dan device ke cabang
 */
const addRoomAndDevice = async (req, res) => {
    try {
        const branchId = BigInt(req.params.id);
        const userId = BigInt(req.user.userId);
        const { categoryId, name, deviceType, version, pricePerHour, roomNumber, status, } = req.body;
        // Cek authorization
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
        if (!hasAccess) {
            res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke cabang ini",
            });
            return;
        }
        // Cek category exist dan di cabang yang benar
        const category = await prisma_1.default.category.findUnique({
            where: { id: BigInt(categoryId) },
        });
        if (!category || category.branchId !== branchId) {
            res.status(404).json({
                success: false,
                message: "Kategori tidak ditemukan atau tidak sesuai dengan cabang",
            });
            return;
        }
        // Cek duplicate room number dalam branch
        const existingRoomAndDevice = await prisma_1.default.roomAndDevice.findFirst({
            where: {
                branchId,
                roomNumber,
            },
        });
        if (existingRoomAndDevice) {
            res.status(400).json({
                success: false,
                message: "Nomor ruangan sudah digunakan di cabang ini",
            });
            return;
        }
        // Buat device
        const roomAndDevice = await prisma_1.default.roomAndDevice.create({
            data: {
                branchId,
                categoryId,
                name,
                deviceType,
                version,
                pricePerHour,
                roomNumber,
                status,
            },
            include: {
                category: true,
            },
        });
        // Log audit
        await prisma_1.default.auditLog.create({
            data: {
                userId,
                action: "ADD_ROOM_AND_DEVICE",
                entity: "RoomAndDevice",
                entityId: roomAndDevice.id,
                meta: {
                    branchId: branchId.toString(),
                    categoryId: categoryId.toString(),
                    deviceType,
                    roomNumber,
                    timestamp: new Date().toISOString(),
                },
            },
        });
        // Auto-update branch amenities
        try {
            await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
        }
        catch (error) {
            console.error("Failed to update branch amenities:", error);
            // Don't fail the request if amenities update fails
        }
        // Auto-update branch amenities
        try {
            await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
        }
        catch (error) {
            console.error("Failed to update branch amenities:", error);
            // Don't fail the request if amenities update fails
        }
        // Convert BigInt to string for JSON serialization
        const serializedDevice = JSON.parse(JSON.stringify(roomAndDevice, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(201).json({
            success: true,
            message: "Room and Device berhasil ditambahkan",
            data: serializedDevice,
        });
    }
    catch (error) {
        console.error("Add room and device error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menambahkan device",
        });
    }
};
exports.addRoomAndDevice = addRoomAndDevice;
/**
 * GET /branches/:branchId/rooms-and-devices
 * Mendapatkan semua room dan device di cabang
 */
const getRoomsAndDevices = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const { deviceType, status, categoryId, search } = req.query;
        const where = { branchId };
        if (deviceType) {
            where.deviceType = deviceType;
        }
        if (status) {
            where.status = status;
        }
        if (categoryId) {
            where.categoryId = BigInt(categoryId);
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { roomNumber: { contains: search, mode: "insensitive" } },
            ];
        }
        const roomsAndDevices = await prisma_1.default.roomAndDevice.findMany({
            where,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        tier: true,
                    },
                },
                _count: {
                    select: {
                        sessions: true,
                    },
                },
            },
            orderBy: [{ roomNumber: "asc" }],
        });
        const serialized = JSON.parse(JSON.stringify(roomsAndDevices, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            data: serialized,
        });
    }
    catch (error) {
        console.error("Get rooms and devices error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data rooms and devices",
        });
    }
};
exports.getRoomsAndDevices = getRoomsAndDevices;
/**
 * GET /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Mendapatkan detail room dan device di cabang
 */
const getRoomAndDeviceDetails = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
        const roomAndDevice = await prisma_1.default.roomAndDevice.findUnique({
            where: { id: roomAndDeviceId },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        tier: true,
                        pricePerHour: true,
                        amenities: true,
                    },
                },
                sessions: {
                    where: {
                        status: "running",
                    },
                    orderBy: { startedAt: "desc" },
                    take: 5,
                },
                _count: {
                    select: {
                        sessions: true,
                    },
                },
            },
        });
        if (!roomAndDevice || roomAndDevice.branchId !== branchId) {
            res.status(404).json({
                success: false,
                message: "Room and device tidak ditemukan di cabang ini",
            });
            return;
        }
        const serialized = JSON.parse(JSON.stringify(roomAndDevice, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            data: serialized,
        });
    }
    catch (error) {
        console.error("Get room and device details error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil detail room and device",
        });
    }
};
exports.getRoomAndDeviceDetails = getRoomAndDeviceDetails;
/**
 * PUT /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Owner/staff mengupdate room dan device di cabang
 */
const updateRoomAndDevice = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
        const userId = BigInt(req.user.userId);
        const { categoryId, name, deviceType, version, pricePerHour, roomNumber, status, } = req.body;
        // Cek authorization
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
        if (!hasAccess) {
            res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke cabang ini",
            });
            return;
        }
        // Cek device exist dan di cabang yang benar
        const roomAndDevice = await prisma_1.default.roomAndDevice.findUnique({
            where: { id: roomAndDeviceId },
        });
        if (!roomAndDevice || roomAndDevice.branchId !== branchId) {
            res.status(404).json({
                success: false,
                message: "Room dan device tidak ditemukan di cabang ini",
            });
            return;
        }
        // Cek duplicate room number jika diubah
        if (roomNumber && roomNumber !== roomAndDevice.roomNumber) {
            const existingRoom = await prisma_1.default.roomAndDevice.findFirst({
                where: {
                    branchId,
                    roomNumber,
                    id: { not: roomAndDeviceId },
                },
            });
            if (existingRoom) {
                res.status(400).json({
                    success: false,
                    message: "Nomor ruangan sudah digunakan di cabang ini",
                });
                return;
            }
        }
        // Update device
        const updatedDevice = await prisma_1.default.roomAndDevice.update({
            where: { id: roomAndDeviceId, roomNumber },
            data: {
                categoryId: categoryId !== undefined
                    ? categoryId
                        ? BigInt(categoryId)
                        : null
                    : roomAndDevice.categoryId,
                name: name || roomAndDevice.name,
                deviceType: deviceType || roomAndDevice.deviceType,
                version: version !== undefined ? version : roomAndDevice.version,
                pricePerHour: pricePerHour !== undefined
                    ? pricePerHour
                    : roomAndDevice.pricePerHour,
                roomNumber: roomNumber || roomAndDevice.roomNumber,
                status: status !== undefined ? status : roomAndDevice.status,
            },
            include: {
                category: true,
            },
        });
        // Log audit
        await prisma_1.default.auditLog.create({
            data: {
                userId,
                action: "UPDATE_DEVICE",
                entity: "Device",
                entityId: roomAndDeviceId,
                meta: {
                    branchId: branchId.toString(),
                    changes: req.body,
                    timestamp: new Date().toISOString(),
                },
            },
        });
        // Auto-update branch amenities
        try {
            await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
        }
        catch (error) {
            console.error("Failed to update branch amenities:", error);
            // Don't fail the request if amenities update fails
        }
        // Auto-update branch amenities
        try {
            await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
        }
        catch (error) {
            console.error("Failed to update branch amenities:", error);
            // Don't fail the request if amenities update fails
        }
        // Convert BigInt to string for JSON serialization
        const serializedDevice = JSON.parse(JSON.stringify(updatedDevice, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            message: "Device berhasil diupdate",
            data: serializedDevice,
        });
    }
    catch (error) {
        console.error("Update device error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengupdate device",
        });
    }
};
exports.updateRoomAndDevice = updateRoomAndDevice;
/**
 * DELETE /branches/:branchId/devices/:deviceId
 * Owner/staff menghapus device dari cabang
 */
const deleteRoomAndDevice = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
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
        // Cek device exist dan di cabang yang benar
        const device = await prisma_1.default.roomAndDevice.findUnique({
            where: { id: roomAndDeviceId },
            include: {
                _count: {
                    select: {
                        sessions: true,
                    },
                },
            },
        });
        if (!device || device.branchId !== branchId) {
            res.status(404).json({
                success: false,
                message: "Device tidak ditemukan di cabang ini",
            });
            return;
        }
        // Cek apakah device punya session aktif
        if (device._count.sessions > 0) {
            res.status(400).json({
                success: false,
                message: "Tidak dapat menghapus device yang memiliki riwayat session. Ubah status menjadi 'disabled' jika ingin menonaktifkan.",
            });
            return;
        }
        // Delete device
        await prisma_1.default.roomAndDevice.delete({
            where: { id: roomAndDeviceId },
        });
        // Log audit
        await prisma_1.default.auditLog.create({
            data: {
                userId,
                action: "DELETE_DEVICE",
                entity: "Device",
                entityId: roomAndDeviceId,
                meta: {
                    branchId: branchId.toString(),
                    deviceType: device.deviceType,
                    timestamp: new Date().toISOString(),
                },
            },
        });
        // Auto-update branch amenities
        try {
            await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
        }
        catch (error) {
            console.error("Failed to update branch amenities:", error);
            // Don't fail the request if amenities update fails
        }
        res.status(200).json({
            success: true,
            message: "Device berhasil dihapus",
        });
    }
    catch (error) {
        console.error("Delete device error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus device",
        });
    }
};
exports.deleteRoomAndDevice = deleteRoomAndDevice;
//# sourceMappingURL=RoomAndDeviceController.js.map