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
import { validate } from "../middleware/validateMiddleware";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "../validation/subscriptionValidation";

const router = Router();

// Owner routes only
router.post(
  "/",
  authenticateToken,
  requireOwner,
  validate(createSubscriptionSchema),
  createSubscription
);

router.get("/", authenticateToken, requireOwner, getSubscriptions);
router.get("/active", authenticateToken, requireOwner, getActiveSubscription);
router.get("/:id", authenticateToken, requireOwner, getSubscriptionById);

router.put(
  "/:id",
  authenticateToken,
  requireOwner,
  validate(updateSubscriptionSchema),
  updateSubscription
);

router.delete("/:id", authenticateToken, requireOwner, deleteSubscription);

export default router;
