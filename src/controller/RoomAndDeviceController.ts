import { Request, Response } from "express";
import { handleError } from "../helper/responseHelper";
import {
  addRoomAndDeviceService,
  getRoomsAndDevicesService,
  getRoomAndDeviceDetailsService,
  updateRoomAndDeviceService,
  deleteRoomAndDeviceService,
} from "../service/RoomAndDeviceService/roomAndDeviceService";

/**
 * POST /branches/:id/rooms-and-devices
 * Add room and device to branch (admin/owner only)
 */
export const addRoomAndDevice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const branchId = BigInt(req.params.id);
    const {
      categoryId,
      name,
      deviceType,
      version,
      pricePerHour,
      roomNumber,
    } = req.body;

    const roomAndDevice = await addRoomAndDeviceService({
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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /branches/:branchId/rooms-and-devices
 * Get rooms and devices by branch with filters
 */
export const getRoomsAndDevices = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { deviceType, status, categoryId, search, skip, take } = req.query;

    const { devices, total } = await getRoomsAndDevicesService({
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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Get room and device details by ID
 */
export const getRoomAndDeviceDetails = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);

    const device = await getRoomAndDeviceDetailsService({
      roomAndDeviceId,
      branchId,
    });

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PUT /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Update room and device (admin/owner only)
 */
export const updateRoomAndDevice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const branchId = BigInt(req.params.branchId);
    const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
    const {
      categoryId,
      name,
      deviceType,
      version,
      pricePerHour,
      roomNumber,
      status,
    } = req.body;

    const device = await updateRoomAndDeviceService({
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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * DELETE /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Delete room and device (admin/owner only)
 */
export const deleteRoomAndDevice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const branchId = BigInt(req.params.branchId);
    const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);

    await deleteRoomAndDeviceService({
      userId,
      branchId,
      roomAndDeviceId,
    });

    res.status(200).json({
      success: true,
      message: "Room and Device berhasil dihapus",
    });
  } catch (error) {
    handleError(error, res);
  }
};
