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
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validation/bodyValidation/reviewValidation";

const router = Router();

// Customer routes
router.post(
  "/",
  authenticateToken,
  requireCustomer,
  ValidateMiddleware.validateBody(createReviewSchema),
  createReview,
);

router.put(
  "/:id",
  authenticateToken,
  requireCustomer,
  ValidateMiddleware.validateBody(updateReviewSchema),
  updateReview,
);

router.delete("/:id", authenticateToken, requireCustomer, deleteReview);

// Public routes - no authentication required
router.get("/", getReviews);
router.get("/:id", getReviewById);

export default router;
