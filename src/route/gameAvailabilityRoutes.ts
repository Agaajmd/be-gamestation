import { Router } from "express";
import * as gameAvailabilityController from "../controller/GameAvailabilityController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwnerOrAdmin } from "../middleware/roleMiddleware";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import {
  addGamesToDeviceSchema,
  removeGamesFromDeviceSchema,
} from "../validation/bodyValidation/gameAvailibilityValidation";

const router = Router();

/**
 * @route   POST /branches/:branchId/rooms-and-devices/:roomAndDeviceId/games
 * @desc    Menambahkan 1 atau lebih game ke device
 * @access  Private (Owner/Admin)
 */
router.post(
  "/:branchId/rooms-and-devices/:roomAndDeviceId/games",
  authenticateToken,
  requireOwnerOrAdmin,
  ValidateMiddleware.validateBody(addGamesToDeviceSchema),
  gameAvailabilityController.addGamesToDevice
);

/**
 * @route   DELETE /branches/:branchId/rooms-and-devices/:roomAndDeviceId/games
 * @desc    Menghapus 1 atau lebih game dari device
 * @access  Private (Owner/Admin)
 */
router.delete(
  "/:branchId/rooms-and-devices/:roomAndDeviceId/games",
  authenticateToken,
  requireOwnerOrAdmin,
  ValidateMiddleware.validateBody(removeGamesFromDeviceSchema),
  gameAvailabilityController.removeGamesFromDevice
);

export default router;
