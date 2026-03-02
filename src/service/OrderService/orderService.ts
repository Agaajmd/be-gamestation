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
import { sanitizeString, sanitizeNumber } from "../../helper/inputSanitizer";

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
  MissingCustomerIdentifierError,
  MissingGuestCustomerPhoneError,
  InvalidCartItemsError,
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
    const allPrices = await AdvanceBookingPriceRepository.findAll({
      branchId,
      minDays: { lte: daysFromToday },
    });

    const advancePrice = allPrices.find(
      (p) => p.maxDays === null || p.maxDays >= daysFromToday,
    );

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
    durationMinutes: rawDuration,
    categoryId,
    roomAndDeviceId,
    notes: rawNotes,
  } = payload;

  // Sanitize inputs
  const durationMinutes = sanitizeNumber(rawDuration, 0) || 0;
  const notes = rawNotes ? sanitizeString(rawNotes) : undefined;

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
 * Validate order before checkout - Check if order items are still valid
 * Validates booking times, device availability, and conflict with other bookings
 */
export const validateOrderBeforeCheckoutService = async (
  orderId: bigint,
): Promise<{ isValid: boolean; invalidItems: any[] }> => {
  const order = await OrderRepository.findById(orderId);

  if (!order) {
    throw new OrderNotFoundError();
  }

  const invalidItems: any[] = [];

  for (const item of order.orderItems) {
    // Check if item booking time is still in the future
    if (isPastTime(item.bookingStart, new Date())) {
      invalidItems.push({
        itemId: item.id,
        roomAndDeviceId: item.roomAndDeviceId,
        reason: "Waktu pemesanan telah berlalu",
        bookingStart: item.bookingStart,
      });
      continue;
    }

    // Check if device is still available
    const device = await RoomAndDeviceRepository.findUnique(
      {
        id: item.roomAndDeviceId,
      },
      { include: { category: true } },
    );

    if (!device || device.status !== "available") {
      invalidItems.push({
        itemId: item.id,
        roomAndDeviceId: item.roomAndDeviceId,
        reason: "Device tidak tersedia lagi",
        deviceStatus: device?.status || "tidak ditemukan",
      });
      continue;
    }

    // Check for conflicting bookings with other orders
    if (order.customerId) {
      // Member order: check conflicts only for same customer
      const conflictingOrder = await OrderQuery.findDuplicateOrder(
        item.roomAndDeviceId,
        order.branchId,
        order.customerId,
        item.bookingStart,
        item.bookingEnd,
        orderId, // Exclude current order from conflict check
      );

      if (conflictingOrder) {
        invalidItems.push({
          itemId: item.id,
          roomAndDeviceId: item.roomAndDeviceId,
          reason: "Device sudah terbooking untuk jadwal ini",
          bookingStart: item.bookingStart,
          bookingEnd: item.bookingEnd,
        });
      }
    } else {
      // Guest order: check if device is booked by anyone in that time
      const deviceConflict = await OrderItemRepository.findFirst({
        roomAndDeviceId: item.roomAndDeviceId,
        order: {
          branchId: order.branchId,
          NOT: { id: orderId }, // Exclude current order
          status: {
            in: [OrderStatus.pending, OrderStatus.confirmed, OrderStatus.cart],
          },
        },
        OR: [
          {
            AND: [
              { bookingStart: { lte: item.bookingStart } },
              { bookingEnd: { gt: item.bookingStart } },
            ],
          },
          {
            AND: [
              { bookingStart: { lt: item.bookingEnd } },
              { bookingEnd: { gte: item.bookingEnd } },
            ],
          },
          {
            AND: [
              { bookingStart: { gte: item.bookingStart } },
              { bookingEnd: { lte: item.bookingEnd } },
            ],
          },
        ],
      });

      if (deviceConflict) {
        invalidItems.push({
          itemId: item.id,
          roomAndDeviceId: item.roomAndDeviceId,
          reason: "Device sudah terbooking untuk jadwal ini",
          bookingStart: item.bookingStart,
          bookingEnd: item.bookingEnd,
        });
      }
    }
  }

  return {
    isValid: invalidItems.length === 0,
    invalidItems,
  };
};

/**
 * Checkout order - Convert cart to pending status
 * Handles both regular customer orders and custom orders created by staff
 */
export const checkoutOrderService = async (payload: {
  userId: bigint;
  orderId: bigint;
  paymentId: bigint;
  paymentProofFile?: Express.Multer.File;
  role: string;
}) => {
  const { userId, orderId, paymentId, paymentProofFile, role } = payload;

  // Get order
  const order = await OrderRepository.findById(orderId);

  if (!order) {
    throw new OrderNotFoundError();
  }

  if (role === UserRole.customer) {
    if (order.customerId !== userId) {
      throw new UnauthorizedOrderAccessError();
    }
  } else if (role === UserRole.admin) {
    await checkBranchAccess(userId, order.branchId);
  } else if (role !== UserRole.owner) {
    throw new HasNoAccessError();
  }

  if (order.status !== "cart") {
    throw new InvalidOrderStatusError();
  }

  // Validate order items before checkout
  const validation = await validateOrderBeforeCheckoutService(orderId);
  if (!validation.isValid) {
    throw new InvalidCartItemsError(validation.invalidItems);
  }

  const paymentProofPath = paymentProofFile
    ? `uploads/payment-proofs/${paymentProofFile.filename}`
    : null;

  const isStaff = role === UserRole.admin || role === UserRole.owner;
  const newStatus = isStaff ? "confirmed" : "pending";
  const newPaymentStatus = isStaff ? PaymentStatus.paid : PaymentStatus.pending;

  const updatedOrder = await OrderRepository.update(orderId, {
    status: newStatus,
    paymentStatus: newPaymentStatus,
    paymentId: paymentId || null,
    paymentProofFile: paymentProofPath,
    paymentProofUploadedAt: paymentProofFile ? new Date() : null,
  });

  if (order.customerId) {
    try {
      await createNotificationService({
        userId: order.customerId,
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
    where.customerId = userId;
  } else if (role === UserRole.admin) {
    if (branchId) {
      await checkBranchAccess(userId, branchId);
      where.branchId = branchId;
    } else {
      throw new HasNoAccessError();
    }
  } else if (role === UserRole.owner) {
    if (branchId) {
      where.branchId = branchId;
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

/**
 * Remove item from cart - Customer only
 */
export const removeItemFromCartService = async (payload: {
  userId: bigint;
  orderItemId: bigint;
}) => {
  const { userId, orderItemId } = payload;

  // Get order item with order relation
  const orderItem = (await OrderItemRepository.findById(orderItemId, {
    include: { order: true },
  })) as any;

  if (!orderItem) {
    throw new OrderNotFoundError();
  }

  // Verify ownership and cart status
  if (orderItem.order.customerId !== userId) {
    throw new UnauthorizedOrderAccessError();
  }

  if (orderItem.order.status !== "cart") {
    throw new InvalidOrderStatusError();
  }

  // Remove order item
  await OrderItemRepository.delete(orderItemId);

  const remainingItems = await OrderItemRepository.findMany({
    orderId: orderItem.orderId,
  });

  if (remainingItems.length === 0) {
    await OrderRepository.delete(orderItem.orderId);

    return {
      userId,
      orderItemId,
      orderDeleted: true,
      updatedTotal: 0,
    };
  }

  // Update order total amount
  const updatedTotal =
    Number(orderItem.order.totalAmount) - Number(orderItem.price);

  return {
    userId,
    orderItemId,
    orderDeleted: false,
    updatedTotal,
  };
};

/**
 * Add custom order to cart - Create new order for offline/walk-in customers (staff/owner only)
 * Uses today's date as booking date
 * Supports both member customers (customerId) and guest customers (name + phone)
 */
export const addCustomOrderToCartService = async (payload: {
  staffUserId: bigint;
  branchId: bigint;
  customerId?: bigint;
  guestCustomerName?: string;
  guestCustomerPhone?: string;
  guestCustomerEmail?: string;
  startTime: string;
  durationMinutes: number;
  categoryId: bigint;
  roomAndDeviceId: bigint;
  notes?: string;
}) => {
  const {
    staffUserId,
    branchId,
    customerId,
    guestCustomerName: rawGuestName,
    guestCustomerPhone: rawGuestPhone,
    guestCustomerEmail: rawGuestEmail,
    startTime,
    durationMinutes: rawDuration,
    categoryId,
    roomAndDeviceId,
    notes: rawNotes,
  } = payload;

  // Sanitize inputs
  const durationMinutes = sanitizeNumber(rawDuration, 0) || 0;
  const notes = rawNotes ? sanitizeString(rawNotes) : undefined;
  const guestCustomerName = rawGuestName
    ? sanitizeString(rawGuestName)
    : undefined;
  const guestCustomerPhone = rawGuestPhone
    ? sanitizeString(rawGuestPhone)
    : undefined;
  const guestCustomerEmail = rawGuestEmail
    ? sanitizeString(rawGuestEmail)
    : undefined;

  // Check branch access for staff
  await checkBranchAccess(staffUserId, branchId);

  // Validate that either customerId OR guest details are provided
  if (!customerId && !guestCustomerName) {
    throw new MissingCustomerIdentifierError();
  }

  if (!customerId && !guestCustomerPhone) {
    throw new MissingGuestCustomerPhoneError();
  }

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

  // Use today's date for walk-in/offline orders
  const bookingDate = new Date();
  bookingDate.setHours(0, 0, 0, 0);

  // Parse booking date and time
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const bookingStart = new Date(bookingDate);
  bookingStart.setHours(startHours, startMinutes, 0, 0);

  const bookingEnd = new Date(bookingStart);
  bookingEnd.setMinutes(
    bookingEnd.getMinutes() + parseInt(String(durationMinutes)),
  );

  // Check if booking time is not in the past
  if (isPastTime(bookingStart, bookingDate)) {
    throw new BookingInPastError();
  }

  // Only check duplicate booking if it's a member customer
  if (customerId) {
    const duplicateOrder = await OrderQuery.findDuplicateOrder(
      roomAndDeviceId,
      branchId,
      customerId,
      bookingStart,
      bookingEnd,
    );

    if (duplicateOrder) {
      throw new DuplicateBookingError();
    }
  }

  // Calculate pricing - use today's date string for calculation
  const todayString = bookingDate.toISOString().split("T")[0];
  const pricing = await calculateBookingPriceService(
    branchId,
    roomAndDeviceId,
    categoryId,
    todayString,
    durationMinutes,
  );

  // Check if customer already has a cart order for this branch, only for member customers
  if (customerId) {
    const existingCartOrder = await OrderRepository.getCartOrder(
      customerId,
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
  }

  // For guest orders, always create a new order (no appending to existing)
  // Create order with order items (add to cart)
  return OrderRepository.create({
    orderCode: generateOrderCode(),
    customerId: customerId || null,
    branchId,
    status: "cart",
    totalAmount: pricing.totalAmount,
    paymentStatus: "unpaid",
    guestCustomerName: guestCustomerName || null,
    guestCustomerPhone: guestCustomerPhone || null,
    guestCustomerEmail: guestCustomerEmail || null,
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
