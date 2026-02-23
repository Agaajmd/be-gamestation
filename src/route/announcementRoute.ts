import { Router } from "express";
import {
  createAnnouncement,
  getAnnouncements,
  getActiveAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controller/AnnouncementController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwnerOrAdmin } from "../middleware/roleMiddleware";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "../validation/bodyValidation/announcementValidation";
import { uploadImage } from "../helper/uploadImage";

const router = Router();

// Public routes (no authentication required)
router.get("/active", getActiveAnnouncements);

// All routes
router.get("/", getAnnouncements);
router.get("/:id", getAnnouncementById);

// Admin/Owner routes only
router.post(
  "/",
  authenticateToken,
  requireOwnerOrAdmin,
  uploadImage.single("imageFile"),
  ValidateMiddleware.validateBody(createAnnouncementSchema),
  createAnnouncement,
);

router.put(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  uploadImage.single("imageFile"),
  ValidateMiddleware.validateBody(updateAnnouncementSchema),
  updateAnnouncement,
);

router.delete(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  deleteAnnouncement,
);

export default router;
