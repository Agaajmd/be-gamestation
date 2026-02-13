"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoomAndDeviceService = exports.updateRoomAndDeviceService = exports.getRoomAndDeviceDetailsService = exports.getRoomsAndDevicesService = exports.addRoomAndDeviceService = void 0;
const database_1 = require("../../database");
const branchRepository_1 = require("../../repository/branchRepository");
const categoryRepository_1 = require("../../repository/categoryRepository");
const roomAndDeviceRepository_1 = require("../../repository/roomAndDeviceRepository");
const checkBranchAccessHelper_1 = require("../../helper/checkBranchAccessHelper");
const branchAmenitiesHelper_1 = require("../../helper/branchAmenitiesHelper");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Queries
const roomAndDeviceQuery_1 = require("../../queries/roomAndDeviceQuery");
// Error imports
const userError_1 = require("../../errors/UserError/userError");
const branchError_1 = require("../../errors/BranchError/branchError");
const categoryError_1 = require("../../errors/CategoryError/categoryError");
const roomAndDeviceError_1 = require("../../errors/RoomAndDeviceError/roomAndDeviceError");
/**
 * Add room and device to branch
 */
const addRoomAndDeviceService = async (payload) => {
    const { userId, branchId, categoryId, name: rawName, deviceType: rawDeviceType, version: rawVersion, pricePerHour: rawPrice, roomNumber: rawRoomNumber, } = payload;
    // Sanitize inputs
    const name = (0, inputSanitizer_1.sanitizeString)(rawName);
    const deviceType = (0, inputSanitizer_1.sanitizeString)(rawDeviceType);
    const version = (0, inputSanitizer_1.sanitizeString)(rawVersion);
    const pricePerHour = (0, inputSanitizer_1.sanitizeNumber)(rawPrice, 0) || 0;
    const roomNumber = (0, inputSanitizer_1.sanitizeString)(rawRoomNumber);
    // Verify authorization
    const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
    if (!hasAccess) {
        throw new userError_1.HasNoAccessError();
    }
    // Verify branch exists
    const branch = await branchRepository_1.BranchRepository.findById(branchId);
    if (!branch) {
        throw new branchError_1.BranchNotFoundError();
    }
    // Verify category exists and belongs to branch
    const category = await categoryRepository_1.CategoryRepository.findById(categoryId);
    if (!category || category.branchId !== branchId) {
        throw new categoryError_1.CategoryNotFoundError();
    }
    // Check duplicate room number
    const existingRoom = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findFirst({
        branchId,
        roomNumber,
    });
    if (existingRoom) {
        throw new roomAndDeviceError_1.DuplicateRoomAndDeviceError();
    }
    // Create device
    const device = await roomAndDeviceRepository_1.RoomAndDeviceRepository.create({
        branchId,
        categoryId,
        name,
        deviceType,
        version,
        pricePerHour,
        roomNumber,
        status: "available",
    });
    // Create audit log
    await database_1.prisma.auditLog.create({
        data: {
            userId,
            action: "ADD_ROOM_AND_DEVICE",
            entity: "RoomAndDevice",
            entityId: device.id,
            meta: {
                branchId: branchId.toString(),
                categoryId: categoryId.toString(),
                deviceType,
                roomNumber,
                timestamp: new Date().toISOString(),
            },
        },
    });
    // Update branch amenities (single call)
    try {
        await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
    }
    catch (error) {
        console.error("Failed to update branch amenities:", error);
        // Don't fail the request if amenities update fails
    }
    return device;
};
exports.addRoomAndDeviceService = addRoomAndDeviceService;
/**
 * Get rooms and devices by branch with filters
 */
const getRoomsAndDevicesService = async (payload) => {
    const { branchId, deviceType: rawDeviceType, status: rawStatus, categoryId, search: rawSearch, skip = 0, take = 10, } = payload;
    // Sanitize string inputs
    const deviceType = rawDeviceType ? (0, inputSanitizer_1.sanitizeString)(rawDeviceType) : undefined;
    const status = rawStatus ? (0, inputSanitizer_1.sanitizeString)(rawStatus) : undefined;
    const search = rawSearch ? (0, inputSanitizer_1.sanitizeString)(rawSearch) : undefined;
    const where = { branchId };
    if (deviceType && deviceType !== "undefined") {
        where.deviceType = deviceType;
    }
    if (status && status !== "undefined") {
        where.status = status;
    }
    if (categoryId) {
        where.categoryId = categoryId;
    }
    if (search && search !== "undefined") {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { roomNumber: { contains: search, mode: "insensitive" } },
        ];
    }
    const devices = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findMany(where, skip, take);
    const total = await roomAndDeviceRepository_1.RoomAndDeviceRepository.count(where);
    return { devices, total };
};
exports.getRoomsAndDevicesService = getRoomsAndDevicesService;
/**
 * Get room and device details by ID
 */
const getRoomAndDeviceDetailsService = async (payload) => {
    const { roomAndDeviceId, branchId } = payload;
    const device = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findById(roomAndDeviceId);
    if (!device || device.branchId !== branchId) {
        throw new roomAndDeviceError_1.RoomAndDeviceNotFoundError();
    }
    // Get additional details with sessions
    const deviceWithSessions = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findUnique({
        id: roomAndDeviceId,
    }, {
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
    return deviceWithSessions;
};
exports.getRoomAndDeviceDetailsService = getRoomAndDeviceDetailsService;
/**
 * Update room and device
 */
const updateRoomAndDeviceService = async (payload) => {
    const { userId, branchId, roomAndDeviceId, categoryId, name: rawName, deviceType: rawDeviceType, version: rawVersion, pricePerHour: rawPrice, roomNumber: rawRoomNumber, status: rawStatus, } = payload;
    // Sanitize inputs
    const name = rawName ? (0, inputSanitizer_1.sanitizeString)(rawName) : undefined;
    const deviceType = rawDeviceType ? (0, inputSanitizer_1.sanitizeString)(rawDeviceType) : undefined;
    const version = rawVersion ? (0, inputSanitizer_1.sanitizeString)(rawVersion) : undefined;
    const pricePerHour = rawPrice ? (0, inputSanitizer_1.sanitizeNumber)(rawPrice, 0) : undefined;
    const roomNumber = rawRoomNumber ? (0, inputSanitizer_1.sanitizeString)(rawRoomNumber) : undefined;
    const status = rawStatus ? (0, inputSanitizer_1.sanitizeString)(rawStatus) : undefined;
    // Verify authorization
    const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
    if (!hasAccess) {
        throw new userError_1.HasNoAccessError();
    }
    // Get existing device
    const device = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findById(roomAndDeviceId, branchId);
    if (!device) {
        throw new roomAndDeviceError_1.RoomAndDeviceNotFoundError();
    }
    // Check for duplicate room number if being changed
    if (roomNumber && roomNumber !== device.roomNumber) {
        const existingRoom = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findFirst({
            branchId,
            roomNumber,
            id: { not: roomAndDeviceId },
        });
        if (existingRoom) {
            throw new roomAndDeviceError_1.DuplicateRoomAndDeviceError();
        }
    }
    // Verify category if provided
    if (categoryId) {
        const category = await database_1.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category || category.branchId !== branchId) {
            throw new categoryError_1.CategoryNotFoundError();
        }
    }
    // Update device
    const updateData = {};
    if (categoryId !== undefined) {
        updateData.categoryId = categoryId;
    }
    if (name !== undefined) {
        updateData.name = name;
    }
    if (deviceType !== undefined) {
        updateData.deviceType = deviceType;
    }
    if (version !== undefined) {
        updateData.version = version;
    }
    if (pricePerHour !== undefined) {
        updateData.pricePerHour = pricePerHour;
    }
    if (roomNumber !== undefined) {
        updateData.roomNumber = roomNumber;
    }
    if (status !== undefined) {
        updateData.status = status;
    }
    const updatedDevice = await roomAndDeviceRepository_1.RoomAndDeviceRepository.update(roomAndDeviceId, updateData);
    // Create audit log
    await database_1.prisma.auditLog.create({
        data: {
            userId,
            action: "UPDATE_ROOM_AND_DEVICE",
            entity: "RoomAndDevice",
            entityId: roomAndDeviceId,
            meta: {
                branchId: branchId.toString(),
                changes: updateData,
                timestamp: new Date().toISOString(),
            },
        },
    });
    // Update branch amenities (single call - FIXED duplication)
    try {
        await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
    }
    catch (error) {
        console.error("Failed to update branch amenities:", error);
        // Don't fail the request if amenities update fails
    }
    return updatedDevice;
};
exports.updateRoomAndDeviceService = updateRoomAndDeviceService;
/**
 * Delete room and device
 */
const deleteRoomAndDeviceService = async (payload) => {
    const { userId, branchId, roomAndDeviceId } = payload;
    // Verify authorization
    const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
    if (!hasAccess) {
        throw new userError_1.HasNoAccessError();
    }
    // Get device with session count
    const device = await roomAndDeviceQuery_1.RoomAndDeviceQuery.findUniqueWithCount(roomAndDeviceId);
    if (!device || device.branchId !== branchId) {
        throw new roomAndDeviceError_1.RoomAndDeviceNotFoundError();
    }
    // Check if device has sessions
    if (device._count.sessions > 0) {
        throw new roomAndDeviceError_1.DeviceHasActiveSessionError();
    }
    // Check if device has order items
    if (device._count.orderItems > 0) {
        throw new roomAndDeviceError_1.DeviceHasOrderItemsError();
    }
    // Delete device
    await roomAndDeviceRepository_1.RoomAndDeviceRepository.delete(roomAndDeviceId);
    // Create audit log
    await database_1.prisma.auditLog.create({
        data: {
            userId,
            action: "DELETE_ROOM_AND_DEVICE",
            entity: "RoomAndDevice",
            entityId: roomAndDeviceId,
            meta: {
                branchId: branchId.toString(),
                deviceType: device.deviceType,
                timestamp: new Date().toISOString(),
            },
        },
    });
    // Update branch amenities (single call)
    try {
        await (0, branchAmenitiesHelper_1.updateBranchAmenities)(branchId);
    }
    catch (error) {
        console.error("Failed to update branch amenities:", error);
        // Don't fail the request if amenities update fails
    }
    return { success: true };
};
exports.deleteRoomAndDeviceService = deleteRoomAndDeviceService;
//# sourceMappingURL=roomAndDeviceService.js.map