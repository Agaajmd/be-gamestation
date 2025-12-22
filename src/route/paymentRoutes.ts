import { Router } from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
} from "../controller/PaymentController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwnerOrAdmin } from "../middleware/roleMiddleware";
import { validate } from "../middleware/validateMiddleware";
import {
  createPaymentSchema,
  updatePaymentSchema,
} from "../validation/paymentValidation";

const router = Router();

// All authenticated users can create payment
router.post(
  "/",
  authenticateToken,
  validate(createPaymentSchema),
  createPayment
);

// Admin/Owner only
router.get("/", authenticateToken, requireOwnerOrAdmin, getPayments);
router.get("/:id", authenticateToken, getPaymentById);
router.put(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  validate(updatePaymentSchema),
  updatePayment
);

export default router;
