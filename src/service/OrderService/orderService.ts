// Repositories
import { OrderRepository } from "../../repository/orderRepository";
import { OrderItemRepository } from "../../repository/orderItemRepository";
import { RoomAndDeviceRepository } from "../../repository/roomAndDeviceRepository";
import { CategoryRepository } from "../../repository/categoryRepository";
import { AdvanceBookingPriceRepository } from "../../repository/advanceBookingPriceRepository";

// Queries
import { OrderQuery } from "../../queries/orderQuery";

import { checkBranchAccess } from "../../helper/checkBranchAccessHelper";
import { isPastDate } from "../../helper/bookingAvailability/isPastDate";
import { isPastTime } from "../../helper/isPastTime";
import { createNotificationService } from "../NotificationService/notificationService";
import { prisma } from "../../database";

// Errors
import { RoomAndDeviceUnavailableError } from "../../errors/RoomAndDeviceError/roomAndDeviceError";
import { CategoryNotFoundError } from "../../errors/CategoryError/categoryError";
import {
  BookingInPastError,
  DuplicateBookingError,
  OrderNotFoundError,
  InvalidOrderStatusError,
  InvalidPaymentStatusError,
  UnauthorizedOrderAccessError,
} from "../../errors/OrderError/orderError";
import { HasNoAccessError } from "../../errors/UserError/userError";

// Types
import { OrderStatus, PaymentStatus, UserRole } from "@prisma/client";

/**
 * Generate unique order code
 */
const generateOrderCode = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

/**
 * Calculate booking price using booking flow calculation
 */
export const calculateBookingPriceService = async (
  branchId: bigint,
  deviceId: bigint,
  categoryId: bigint,
  bookingDate: string,
  durationMinutes: number,
) => {
  const roomAndDevice = await RoomAndDeviceRepository.findUnique(
    {
      id: deviceId,
    },
    { include: { category: true } },
  );

  if (!roomAndDevice) {
    throw new RoomAndDeviceUnavailableError();
  }

  const category = await CategoryRepository.findById(categoryId);

  if (!category) {
    throw new CategoryNotFoundError();
  }

  // Calculate base amount
  const hours = durationMinutes / 60;
  const baseAmount = Number(roomAndDevice.pricePerHour) * hours;

  // Calculate category fee
  const categoryFee = Number(category.pricePerHour) * hours;

  // Calculate advance booking fee
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDateObj = new Date(bookingDate);
  const daysFromToday = Math.floor(
    (bookingDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  let advanceBookingFee = 0;
  if (daysFromToday > 0) {
    const advancePrice = await AdvanceBookingPriceRepository.findFirst({
      where: {
        branchId,
        minDays: { lte: daysFromToday },
        OR: [{ maxDays: { gte: daysFromToday } }, { maxDays: null }],
      },
    });

    if (advancePrice) {
      advanceBookingFee = Number(advancePrice.additionalFee) * hours;
    }
  }

  const totalAmount = baseAmount + categoryFee + advanceBookingFee;

  return {
    baseAmount,
    categoryFee,
    advanceBookingFee,
    totalAmount,
  };
};

/**
 * Add to cart - Create new order with cart status
 */
export const addToCartService = async (payload: {
  userId: bigint;
  branchId: bigint;
  bookingDate: string;
  startTime: string;
  durationMinutes: number;
  categoryId: bigint;
  roomAndDeviceId: bigint;
  notes?: string;
}) => {
  const {
    userId,
    branchId,
    bookingDate,
    startTime,
    durationMinutes,
    categoryId,
    roomAndDeviceId,
    notes,
  } = payload;
  // Verify room and device availability
  const roomAndDevice = await RoomAndDeviceRepository.findFirst({
    id: roomAndDeviceId,
    branchId,
    categoryId,
    status: "available",
  });

  if (!roomAndDevice) {
    throw new RoomAndDeviceUnavailableError();
  }

  // Check if booking date is in the past
  const bookingDateObj = new Date(bookingDate);
  if (isPastDate(bookingDateObj)) {
    throw new BookingInPastError();
  }

  // Parse booking date and time
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const bookingStart = new Date(bookingDateObj);
  bookingStart.setHours(startHours, startMinutes, 0, 0);

  const bookingEnd = new Date(bookingStart);
  bookingEnd.setMinutes(
    bookingEnd.getMinutes() + parseInt(String(durationMinutes)),
  );

  // Check if booking time is within branch operating hours and not in the past
  const bookingDateOnly = new Date(bookingDate);
  bookingDateOnly.setHours(0, 0, 0, 0);
  if (isPastTime(bookingStart, bookingDateOnly)) {
    throw new BookingInPastError();
  }

  // Check duplicate booking in cart
  const duplicateOrder = await OrderQuery.findDuplicateOrder(
    roomAndDeviceId,
    branchId,
    userId,
    bookingStart,
    bookingEnd,
  );

  if (duplicateOrder) {
    throw new DuplicateBookingError();
  }

  // Calculate pricing
  const pricing = await calculateBookingPriceService(
    branchId,
    roomAndDeviceId,
    categoryId,
    bookingDate,
    durationMinutes,
  );

  // Check if user already has a cart order, if so, append to it
  const existingCartOrder = await OrderRepository.getCartOrder(
    userId,
    branchId,
  );

  if (existingCartOrder) {
    // Add new order item to existing cart
    await OrderItemRepository.create({
      orderId: existingCartOrder.id,
      roomAndDeviceId,
      bookingStart,
      bookingEnd,
      durationMinutes,
      price: pricing.totalAmount.toString(),
      baseAmount: pricing.baseAmount.toString(),
      categoryFee: pricing.categoryFee.toString(),
      advanceBookingFee: pricing.advanceBookingFee.toString(),
    });

    const updatedTotal =
      Number(existingCartOrder.totalAmount) + pricing.totalAmount;
    return OrderRepository.update(existingCartOrder.id, {
      totalAmount: updatedTotal,
    });
  }

  // Create order with order items (add to cart)
  return OrderRepository.create({
    orderCode: generateOrderCode(),
    customerId: userId,
    branchId,
    status: "cart",
    totalAmount: pricing.totalAmount,
    paymentStatus: "unpaid",
    notes,
    orderItems: {
      create: {
        roomAndDeviceId,
        bookingStart,
        bookingEnd,
        durationMinutes,
        price: pricing.totalAmount.toString(),
        baseAmount: pricing.baseAmount.toString(),
        categoryFee: pricing.categoryFee.toString(),
        advanceBookingFee: pricing.advanceBookingFee.toString(),
      },
    },
  });
};

/**
 * Checkout order - Convert cart to pending status
 */
export const checkoutOrderService = async (payload: {
  userId: bigint;
  orderId: bigint;
  paymentId: bigint;
  paymentProofFile?: Express.Multer.File;
}) => {
  const { userId, orderId, paymentId, paymentProofFile } = payload;

  // Get order
  const order = await OrderRepository.findById(orderId);

  if (!order) {
    throw new OrderNotFoundError();
  }

  // Verify ownership
  if (order.customerId !== userId) {
    throw new UnauthorizedOrderAccessError();
  }

  // Verify order is in cart status
  if (order.status !== "cart") {
    throw new InvalidOrderStatusError();
  }

  // Update order to pending
  const paymentProofPath = paymentProofFile
    ? `uploads/payment-proofs/${paymentProofFile.filename}`
    : null;

  const updatedOrder = await OrderRepository.update(orderId, {
    status: "pending",
    paymentStatus: PaymentStatus.pending,
    paymentId: paymentId || null,
    paymentProofFile: paymentProofPath,
    paymentProofUploadedAt: paymentProofFile ? new Date() : null,
  });

  // Create notification for customer
  try {
    await createNotificationService({
      userId,
      type: "order_checkout",
      channel: "email",
      payload: {
        subject: "Order Checkout Successful",
        message:
          "Pesanan Anda telah berhasil di-checkout. Menunggu konfirmasi dari admin.",
        orderCode: updatedOrder.orderCode,
      },
    });
  } catch (error) {
    console.warn("Notification creation skipped:", error);
  }

  return updatedOrder;
};

/**
 * Get orders - Role-based filtering
 */
export const getOrdersService = async (payload: {
  userId: bigint;
  role: string;
  branchId?: bigint;
  status?: string;
  skip?: number;
  take?: number;
}) => {
  const { userId, role, branchId, status, skip = 0, take = 10 } = payload;

  const where: any = {};

  if (role === UserRole.customer) {
    // Customers can only see their own orders
    where.customerId = userId;
  } else if (role === UserRole.admin || role === UserRole.owner) {
    // Admins and owners can see orders for their branch
    if (branchId) {
      // Verify access to branch
      await checkBranchAccess(userId, branchId);
      where.branchId = branchId;
    } else {
      throw new HasNoAccessError();
    }
  } else {
    throw new HasNoAccessError();
  }

  if (status && status !== "undefined") {
    where.status = status;
  }

  const orders = await OrderRepository.findMany(where, skip, take);
  const total = await OrderRepository.count(where);

  return { orders, total };
};

/**
 * Get order by ID - Role-based access control
 */
export const getOrderByIdService = async (payload: {
  userId: bigint;
  orderId: bigint;
  role: string;
  branchId?: bigint;
}) => {
  const { userId, orderId, role, branchId } = payload;

  const order = await OrderRepository.findById(orderId);

  if (!order) {
    throw new OrderNotFoundError();
  }

  // Access control
  if (role === UserRole.customer) {
    // Customers can only access their own orders
    if (order.customerId !== userId) {
      throw new UnauthorizedOrderAccessError();
    }
  } else if (role === UserRole.admin || role === UserRole.owner) {
    // Admins/owners can access orders from their branch
    if (branchId) {
      await checkBranchAccess(userId, branchId);
      if (order.branchId !== branchId) {
        throw new HasNoAccessError();
      }
    } else {
      throw new HasNoAccessError();
    }
  } else {
    throw new HasNoAccessError();
  }

  return order;
};

/**
 * Update order status - Admin/owner only, with proper status transitions
 */
export const updateOrderStatusService = async (payload: {
  userId: bigint;
  orderId: bigint;
  newStatus: OrderStatus;
  newPaymentStatus?: PaymentStatus;
  branchId: bigint;
}) => {
  const { userId, orderId, newStatus, newPaymentStatus, branchId } = payload;

  // Verify admin/owner access
  const hasAccess = await checkBranchAccess(userId, branchId);
  if (!hasAccess) {
    throw new HasNoAccessError();
  }

  const order = await OrderRepository.findUnique({ id: orderId, branchId });
  if (!order) {
    throw new OrderNotFoundError();
  }

  // Validate order status transitions
  const validOrderTransitions: { [key: string]: string[] } = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
    cart: ["pending"],
  };

  if (!validOrderTransitions[order.status]) {
    throw new InvalidOrderStatusError();
  }

  if (!validOrderTransitions[order.status].includes(newStatus)) {
    throw new InvalidOrderStatusError();
  }

  if (newPaymentStatus) {
    // Validate payment status transitions
    const validPaymentTransitions: { [key: string]: string[] } = {
      unpaid: ["pending", "failed"],
      pending: ["paid", "failed"],
      paid: [],
      failed: ["pending"],
      refund_pending: [],
    };

    if (!validPaymentTransitions[order.paymentStatus]) {
      throw new InvalidPaymentStatusError();
    }

    if (
      !validPaymentTransitions[order.paymentStatus].includes(newPaymentStatus)
    ) {
      throw new InvalidPaymentStatusError();
    }
  }

  const updatedOrder = await OrderRepository.updateStatus(
    orderId,
    newStatus,
    newPaymentStatus,
  );

  // Create notification for customer
  try {
    const statusMessages: { [key: string]: string } = {
      confirmed: "Pesanan Anda telah dikonfirmasi",
      completed: "Pesanan Anda telah selesai",
      cancelled: "Pesanan Anda telah dibatalkan",
    };

    await createNotificationService({
      userId: order.customerId,
      type: `order_${newStatus}`,
      channel: "email",
      payload: {
        subject: `Order Status Update - ${newStatus}`,
        message:
          statusMessages[newStatus] ||
          `Status order berubah menjadi ${newStatus}`,
        orderCode: updatedOrder.orderCode,
      },
    });
  } catch (error) {
    console.warn("Notification creation skipped:", error);
  }

  return updatedOrder;
};

/**
 * Cancel order - Admin/owner only, only if payment is invalid
 */
export const cancelOrderService = async (payload: {
  userId: bigint;
  orderId: bigint;
  branchId: bigint;
  reason?: string;
}) => {
  const { userId, orderId, branchId, reason } = payload;

  // Verify admin/owner access
  const hasAccess = await checkBranchAccess(userId, branchId);
  if (!hasAccess) {
    throw new HasNoAccessError();
  }

  const order = await OrderRepository.findUnique({ id: orderId, branchId });
  if (!order) {
    throw new OrderNotFoundError();
  }

  // Only allow cancellation for pending or confirmed orders
  if (!["pending", "confirmed"].includes(order.status)) {
    throw new InvalidOrderStatusError();
  }

  // Check payment status - only cancel if payment is unpaid or failed
  if (!["unpaid", "paid", "failed"].includes(order.paymentStatus)) {
    throw new InvalidPaymentStatusError();
  }

  // Use transaction to ensure data consistency
  const updatedOrder = await prisma.$transaction(async (tx) => {
    // Update order status to cancelled
    const cancelled = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "cancelled",
        paymentStatus: "failed",
      },
      include: { orderItems: true },
    });

    // Return devices to available status
    for (const item of cancelled.orderItems) {
      // Check if there are other active orders using the same device
      const hasOtherActiveOrder = await tx.orderItem.findFirst({
        where: {
          roomAndDeviceId: item.roomAndDeviceId,
          order: {
            status: { in: ["pending", "confirmed"] },
            id: { not: orderId },
            orderItems: {
              some: {
                bookingEnd: { gt: new Date() },
              },
            },
          },
        },
      });

      // If no other active orders, change device status to available
      if (!hasOtherActiveOrder) {
        await tx.roomAndDevice.update({
          where: { id: item.roomAndDeviceId },
          data: { status: "available" },
        });
      }
    }

    return cancelled;
  });

  // Create notification for customer
  try {
    await createNotificationService({
      userId: order.customerId,
      type: "order_cancelled",
      channel: "email",
      payload: {
        subject: "Order Cancelled",
        message: `Pesanan Anda telah dibatalkan. Alasan: ${reason || "Pembayaran tidak valid"}`,
        orderCode: updatedOrder.orderCode,
      },
    });
  } catch (error) {
    console.warn("Notification creation skipped:", error);
  }

  return updatedOrder;
};
