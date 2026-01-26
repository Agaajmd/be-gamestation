"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoomAndDevice = exports.updateRoomAndDevice = exports.getRoomAndDeviceDetails = exports.getRoomsAndDevices = exports.addRoomAndDevice = void 0;
const responseHelper_1 = require("../helper/responseHelper");
const roomAndDeviceService_1 = require("../service/RoomAndDeviceService/roomAndDeviceService");
/**
 * POST /branches/:id/rooms-and-devices
 * Add room and device to branch (admin/owner only)
 */
const addRoomAndDevice = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const branchId = BigInt(req.params.id);
        const { categoryId, name, deviceType, version, pricePerHour, roomNumber, } = req.body;
        const roomAndDevice = await (0, roomAndDeviceService_1.addRoomAndDeviceService)({
            userId,
            branchId,
            categoryId: BigInt(categoryId),
            name,
            deviceType,
            version,
            pricePerHour,
            roomNumber,
        });
        res.status(201).json({
            success: true,
            message: "Room and Device berhasil ditambahkan",
            data: roomAndDevice,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.addRoomAndDevice = addRoomAndDevice;
/**
 * GET /branches/:branchId/rooms-and-devices
 * Get rooms and devices by branch with filters
 */
const getRoomsAndDevices = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const { deviceType, status, categoryId, search, skip, take } = req.query;
        const { devices, total } = await (0, roomAndDeviceService_1.getRoomsAndDevicesService)({
            branchId,
            deviceType: String(deviceType) || undefined,
            status: String(status) || undefined,
            categoryId: categoryId ? BigInt(String(categoryId)) : undefined,
            search: String(search) || undefined,
            skip: skip ? parseInt(String(skip)) : 0,
            take: take ? parseInt(String(take)) : 10,
        });
        res.status(200).json({
            success: true,
            data: devices,
            meta: {
                total,
                skip,
                take,
            },
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getRoomsAndDevices = getRoomsAndDevices;
/**
 * GET /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Get room and device details by ID
 */
const getRoomAndDeviceDetails = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
        const device = await (0, roomAndDeviceService_1.getRoomAndDeviceDetailsService)({
            roomAndDeviceId,
            branchId,
        });
        res.status(200).json({
            success: true,
            data: device,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getRoomAndDeviceDetails = getRoomAndDeviceDetails;
/**
 * PUT /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Update room and device (admin/owner only)
 */
const updateRoomAndDevice = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const branchId = BigInt(req.params.branchId);
        const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
        const { categoryId, name, deviceType, version, pricePerHour, roomNumber, status, } = req.body;
        const device = await (0, roomAndDeviceService_1.updateRoomAndDeviceService)({
            userId,
            branchId,
            roomAndDeviceId,
            categoryId: categoryId ? BigInt(categoryId) : undefined,
            name,
            deviceType,
            version,
            pricePerHour,
            roomNumber,
            status,
        });
        res.status(200).json({
            success: true,
            message: "Room and Device berhasil diupdate",
            data: device,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateRoomAndDevice = updateRoomAndDevice;
/**
 * DELETE /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Delete room and device (admin/owner only)
 */
const deleteRoomAndDevice = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const branchId = BigInt(req.params.branchId);
        const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
        await (0, roomAndDeviceService_1.deleteRoomAndDeviceService)({
            userId,
            branchId,
            roomAndDeviceId,
        });
        res.status(200).json({
            success: true,
            message: "Room and Device berhasil dihapus",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.deleteRoomAndDevice = deleteRoomAndDevice;
//# sourceMappingURL=RoomAndDeviceController.js.map