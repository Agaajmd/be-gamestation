"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DeviceController = __importStar(require("../controller/RoomAndDeviceController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const ValidateMiddleware = __importStar(require("../middleware/validateMiddleware"));
const roomAndDeviceValidation_1 = require("../validation/bodyValidation/roomAndDeviceValidation");
const router = (0, express_1.Router)();
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
router.get("/:branchId/rooms-and-devices/:roomAndDeviceId", DeviceController.getRoomAndDeviceDetails);
/**
 * @route   POST /branches/:id/rooms-and-devices
 * @desc    Owner/staff menambahkan device
 * @access  Private (Owner/Admin)
 */
router.post("/:id/rooms-and-devices", authMiddleware_1.authenticateToken, ValidateMiddleware.validateBody(roomAndDeviceValidation_1.addRoomAndDeviceSchema), DeviceController.addRoomAndDevice);
/**
 * @route  PUT /branches/:branchId/rooms-and-devices/:deviceId
 * @desc   Owner/staff mengupdate device
 * @access Private (Owner/Admin)
 */
router.put("/:branchId/rooms-and-devices/:roomAndDeviceId", authMiddleware_1.authenticateToken, ValidateMiddleware.validateBody(roomAndDeviceValidation_1.updateRoomAndDeviceSchema), DeviceController.updateRoomAndDevice);
/**
 * @route  DELETE /branches/:branchId/rooms-and-devices/:deviceId
 * @desc   Owner/staff menghapus device
 * @access Private (Owner/Admin)
 */
router.delete("/:branchId/rooms-and-devices/:deviceId", authMiddleware_1.authenticateToken, DeviceController.deleteRoomAndDevice);
exports.default = router;
//# sourceMappingURL=roomAndDeviceRoutes.js.map