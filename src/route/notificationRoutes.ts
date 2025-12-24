import { Router } from "express";
import {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotificationStatus,
  deleteNotification,
} from "../controller/NotificationController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwnerOrAdmin } from "../middleware/roleMiddleware";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import {
  createNotificationSchema,
  updateNotificationStatusSchema,
} from "../validation/bodyValidation/notificationValidation";

const router = Router();

// All authenticated users can get notifications
router.get("/", authenticateToken, getNotifications);
router.get("/:id", authenticateToken, getNotificationById);

// Admin/Owner routes
router.post(
  "/",
  authenticateToken,
  requireOwnerOrAdmin,
  ValidateMiddleware.validateBody(createNotificationSchema),
  createNotification
);

router.put(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  ValidateMiddleware.validateBody(updateNotificationStatusSchema),
  updateNotificationStatus
);

router.delete(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  deleteNotification
);

export default router;
