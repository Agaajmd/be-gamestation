import { Router } from "express";
import * as DeviceController from "../controller/RoomAndDeviceController";
import { authenticateToken } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import {
  addRoomAndDeviceSchema,
  updateRoomAndDeviceSchema,
} from "../validation/roomAndDeviceValidation";

const router = Router();

/**
 * @route   GET /branches/:branchId/rooms-and-devices
 * @desc    Mendapatkan semua room dan device di cabang
 * @access  Public
 */
router.get("/:branchId/rooms-and-devices", DeviceController.getRoomsAndDevices);

/**
 * @route   GET /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * @desc    Mendapatkan detail room dan device
 * @access  Public
 */
router.get(
  "/:branchId/rooms-and-devices/:roomAndDeviceId",
  DeviceController.getRoomAndDeviceDetails
);

/**
 * @route   POST /branches/:id/rooms-and-devices
 * @desc    Owner/staff menambahkan device
 * @access  Private (Owner/Admin)
 */
router.post(
  "/:id/rooms-and-devices",
  authenticateToken,
  validate(addRoomAndDeviceSchema),
  DeviceController.addRoomAndDevice
);

/**
 * @route  PUT /branches/:branchId/rooms-and-devices/:deviceId
 * @desc   Owner/staff mengupdate device
 * @access Private (Owner/Admin)
 */
router.put(
  "/:branchId/rooms-and-devices/:roomAndDeviceId",
  authenticateToken,
  validate(updateRoomAndDeviceSchema),
  DeviceController.updateRoomAndDevice
);

/**
 * @route  DELETE /branches/:branchId/rooms-and-devices/:deviceId
 * @desc   Owner/staff menghapus device
 * @access Private (Owner/Admin)
 */
router.delete(
  "/:branchId/rooms-and-devices/:deviceId",
  authenticateToken,
  DeviceController.deleteRoomAndDevice
);

export default router;
