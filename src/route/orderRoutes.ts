import { Router } from "express";
import {
  addToCart,
  checkoutOrder,
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
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import {
  createOrderSchema,
  checkoutOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from "../validation/bodyValidation/orderValidation";

const router = Router();

// Customer routes
router.post(
  "/",
  authenticateToken,
  requireCustomer,
  ValidateMiddleware.validateBody(createOrderSchema),
  addToCart
);

router.post(
  "/:id/checkout",
  authenticateToken,
  requireCustomer,
  ValidateMiddleware.validateBody(checkoutOrderSchema),
  checkoutOrder
)

router.delete("/:id", authenticateToken, cancelOrder);

// All authenticated users
router.get("/", authenticateToken, getOrders);
router.get("/:id", authenticateToken, getOrderById);

// Admin/Owner routes
router.put(
  "/:id/status",
  authenticateToken,
  requireOwnerOrAdmin,
  ValidateMiddleware.validateBody(updateOrderStatusSchema),
  updateOrderStatus
);

router.put(
  "/:id/payment-status",
  authenticateToken,
  requireOwnerOrAdmin,
  ValidateMiddleware.validateBody(updatePaymentStatusSchema),
  updatePaymentStatus
);

export default router;
