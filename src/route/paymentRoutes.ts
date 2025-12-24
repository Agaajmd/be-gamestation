import { Router } from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
} from "../controller/PaymentController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwnerOrAdmin } from "../middleware/roleMiddleware";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import {
  createPaymentSchema,
  updatePaymentSchema,
} from "../validation/bodyValidation/paymentValidation";

const router = Router();

// All authenticated users can create payment
router.post(
  "/",
  authenticateToken,
  ValidateMiddleware.validateBody(createPaymentSchema),
  createPayment
);

// Admin/Owner only
router.get("/", authenticateToken, requireOwnerOrAdmin, getPayments);
router.get("/:id", authenticateToken, getPaymentById);
router.put(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  ValidateMiddleware.validateBody(updatePaymentSchema),
  updatePayment
);

export default router;
