import { Router } from "express";
import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
} from "../controller/SessionController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwnerOrAdmin } from "../middleware/roleMiddleware";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import {
  createSessionSchema,
  updateSessionSchema,
} from "../validation/bodyValidation/sessionValidation";

const router = Router();

// Admin/Owner routes
router.post(
  "/",
  authenticateToken,
  requireOwnerOrAdmin,
  ValidateMiddleware.validateBody(createSessionSchema),
  createSession
);

router.get("/", authenticateToken, requireOwnerOrAdmin, getSessions);
router.get("/:id", authenticateToken, getSessionById);
router.put(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  ValidateMiddleware.validateBody(updateSessionSchema),
  updateSession
);

export default router;
