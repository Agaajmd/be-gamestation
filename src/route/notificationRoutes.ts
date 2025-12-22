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
import { validate } from "../middleware/validateMiddleware";
import {
  createNotificationSchema,
  updateNotificationStatusSchema,
} from "../validation/notificationValidation";

const router = Router();

// All authenticated users can get notifications
router.get("/", authenticateToken, getNotifications);
router.get("/:id", authenticateToken, getNotificationById);

// Admin/Owner routes
router.post(
  "/",
  authenticateToken,
  requireOwnerOrAdmin,
  validate(createNotificationSchema),
  createNotification
);

router.put(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  validate(updateNotificationStatusSchema),
  updateNotificationStatus
);

router.delete(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  deleteNotification
);

export default router;
