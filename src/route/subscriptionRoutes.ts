import { Router } from "express";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getActiveSubscription,
} from "../controller/SubscriptionController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwner } from "../middleware/roleMiddleware";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "../validation/bodyValidation/subscriptionValidation";

const router = Router();

// Owner routes only
router.post(
  "/",
  authenticateToken,
  requireOwner,
  ValidateMiddleware.validateBody(createSubscriptionSchema),
  createSubscription
);

router.get("/", authenticateToken, requireOwner, getSubscriptions);
router.get("/active", authenticateToken, requireOwner, getActiveSubscription);
router.get("/:id", authenticateToken, requireOwner, getSubscriptionById);

router.put(
  "/:id",
  authenticateToken,
  requireOwner,
  ValidateMiddleware.validateBody(updateSubscriptionSchema),
  updateSubscription
);

router.delete("/:id", authenticateToken, requireOwner, deleteSubscription);

export default router;
