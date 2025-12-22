import { Router } from "express";
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../controller/ReviewController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireCustomer } from "../middleware/roleMiddleware";
import { validate } from "../middleware/validateMiddleware";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validation/reviewValidation";

const router = Router();

// Customer routes
router.post(
  "/",
  authenticateToken,
  requireCustomer,
  validate(createReviewSchema),
  createReview
);

router.put(
  "/:id",
  authenticateToken,
  requireCustomer,
  validate(updateReviewSchema),
  updateReview
);

router.delete("/:id", authenticateToken, requireCustomer, deleteReview);

// All authenticated users
router.get("/", authenticateToken, getReviews);
router.get("/:id", authenticateToken, getReviewById);

export default router;
