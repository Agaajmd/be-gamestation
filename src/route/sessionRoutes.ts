import { Router } from "express";
import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
} from "../controller/SessionController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwnerOrAdmin } from "../middleware/roleMiddleware";
import { validate } from "../middleware/validateMiddleware";
import {
  createSessionSchema,
  updateSessionSchema,
} from "../validation/sessionValidation";

const router = Router();

// Admin/Owner routes
router.post(
  "/",
  authenticateToken,
  requireOwnerOrAdmin,
  validate(createSessionSchema),
  createSession
);

router.get("/", authenticateToken, requireOwnerOrAdmin, getSessions);
router.get("/:id", authenticateToken, getSessionById);
router.put(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  validate(updateSessionSchema),
  updateSession
);

export default router;
