import { Router } from "express";
import {
  addToCart,
  checkoutOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
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


export default router;
