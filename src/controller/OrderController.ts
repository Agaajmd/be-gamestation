import { Request, Response } from "express";
import { handleError } from "../helper/responseHelper";
import {
  addToCartService,
  checkoutOrderService,
  getOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  cancelOrderService,
} from "../service/OrderService/orderService";

/**
 * POST /orders
 * Add to cart - Create new order with cart status (customer only)
 */
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const {
      branchId,
      bookingDate,
      startTime,
      durationMinutes,
      categoryId,
      roomAndDeviceId,
      notes,
    } = req.body;

    const order = await addToCartService({
      userId,
      branchId: BigInt(branchId),
      bookingDate,
      startTime,
      durationMinutes: parseInt(durationMinutes),
      categoryId: BigInt(categoryId),
      roomAndDeviceId: BigInt(roomAndDeviceId),
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Item berhasil ditambahkan ke keranjang",
      data: order,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PUT /orders/:id/checkout
 * Checkout order - Convert cart to pending (customer only)
 */
export const checkoutOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const orderId = BigInt(req.params.id);
    const { paymentMethod } = req.body;
    const paymentProofFile = req.file;

    const order = await checkoutOrderService({
      userId,
      orderId,
      paymentMethod,
      paymentProofFile,
    });

    res.status(200).json({
      success: true,
      message: "Order berhasil di-checkout",
      data: order,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /orders
 * Get orders - Role-based filtering
 */
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const { branchId, status, skip, take } = req.query;

    const { orders, total } = await getOrdersService({
      userId,
      role,
      branchId: branchId ? BigInt(String(branchId)) : undefined,
      status: String(status) || undefined,
      skip: skip ? parseInt(String(skip)) : 0,
      take: take ? parseInt(String(take)) : 10,
    });

    res.status(200).json({
      success: true,
      data: orders,
      meta: {
        total,
        skip,
        take,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /orders/:id
 * Get order by ID - Role-based access control
 */
export const getOrderById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const orderId = BigInt(req.params.id);
    const role = req.user!.role;
    const { branchId } = req.query;

    const order = await getOrderByIdService({
      userId,
      orderId,
      role,
      branchId: branchId ? BigInt(String(branchId)) : undefined,
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PATCH /orders/:id/status
 * Update order status - Admin/owner only with proper status transitions
 */
export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const orderId = BigInt(req.params.id);
    const { branchId, orderStatus, paymentStatus } = req.body;

    const order = await updateOrderStatusService({
      userId,
      orderId,
      newStatus: orderStatus,
      newPaymentStatus: paymentStatus,
      branchId: BigInt(branchId),
    });

    res.status(200).json({
      success: true,
      message: "Status order berhasil diubah",
      data: order,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * DELETE /orders/:id
 * Cancel order - Admin/owner only, only if payment is invalid
 */
export const cancelOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const orderId = BigInt(req.params.id);
    const { branchId, reason } = req.body;

    const order = await cancelOrderService({
      userId,
      orderId,
      branchId: BigInt(branchId),
      reason,
    });

    res.status(200).json({
      success: true,
      message: "Order berhasil dibatalkan",
      data: order,
    });
  } catch (error) {
    handleError(error, res);
  }
};
