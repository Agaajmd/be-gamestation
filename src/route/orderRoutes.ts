import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
} from "../controller/OrderController";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  requireOwnerOrAdmin,
  requireCustomer,
} from "../middleware/roleMiddleware";
import { validate } from "../middleware/validateMiddleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from "../validation/orderValidation";

const router = Router();

// Customer routes
router.post(
  "/",
  authenticateToken,
  requireCustomer,
  validate(createOrderSchema),
  createOrder
);

router.delete("/:id", authenticateToken, cancelOrder);

// All authenticated users
router.get("/", authenticateToken, getOrders);
router.get("/:id", authenticateToken, getOrderById);

// Admin/Owner routes
router.put(
  "/:id/status",
  authenticateToken,
  requireOwnerOrAdmin,
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

router.put(
  "/:id/payment-status",
  authenticateToken,
  requireOwnerOrAdmin,
  validate(updatePaymentStatusSchema),
  updatePaymentStatus
);

export default router;
