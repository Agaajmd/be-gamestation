"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrderService = exports.updateOrderStatusService = exports.getOrderByIdService = exports.getOrdersService = exports.checkoutOrderService = exports.addToCartService = void 0;
// Repositories
const orderRepository_1 = require("../../repository/orderRepository");
const orderItemRepository_1 = require("../../repository/orderItemRepository");
const roomAndDeviceRepository_1 = require("../../repository/roomAndDeviceRepository");
const categoryRepository_1 = require("../../repository/categoryRepository");
const advanceBookingPriceRepository_1 = require("../../repository/advanceBookingPriceRepository");
// Queries
const orderQuery_1 = require("../../queries/orderQuery");
const checkBranchAccessHelper_1 = require("../../helper/checkBranchAccessHelper");
const isPastDate_1 = require("../../helper/bookingAvailability/isPastDate");
const isPastTime_1 = require("../../helper/isPastTime");
const notificationService_1 = require("../NotificationService/notificationService");
const database_1 = require("../../database");
// Errors
const roomAndDeviceError_1 = require("../../errors/RoomAndDeviceError/roomAndDeviceError");
const categoryError_1 = require("../../errors/CategoryError/categoryError");
const orderError_1 = require("../../errors/OrderError/orderError");
const userError_1 = require("../../errors/UserError/userError");
// Types
const client_1 = require("@prisma/client");
/**
 * Generate unique order code
 */
const generateOrderCode = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}-${random}`.toUpperCase();
};
/**
 * Calculate booking price using booking flow calculation
 */
const calculateBookingPrice = async (branchId, deviceId, categoryId, bookingDate, durationMinutes) => {
    const roomAndDevice = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findUnique({
        id: deviceId,
    }, { include: { category: true } });
    if (!roomAndDevice) {
        throw new roomAndDeviceError_1.RoomAndDeviceUnavailableError();
    }
    const category = await categoryRepository_1.CategoryRepository.findById(categoryId);
    if (!category) {
        throw new categoryError_1.CategoryNotFoundError();
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
    const daysFromToday = Math.floor((bookingDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let advanceBookingFee = 0;
    if (daysFromToday > 0) {
        const advancePrice = await advanceBookingPriceRepository_1.AdvanceBookingPriceRepository.findFirst({
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
const addToCartService = async (payload) => {
    const { userId, branchId, bookingDate, startTime, durationMinutes, categoryId, roomAndDeviceId, notes, } = payload;
    // Verify room and device availability
    const roomAndDevice = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findFirst({
        id: roomAndDeviceId,
        branchId,
        categoryId,
        status: "available",
    });
    if (!roomAndDevice) {
        throw new roomAndDeviceError_1.RoomAndDeviceUnavailableError();
    }
    // Check if booking date is in the past
    const bookingDateObj = new Date(bookingDate);
    if ((0, isPastDate_1.isPastDate)(bookingDateObj)) {
        throw new orderError_1.BookingInPastError();
    }
    // Parse booking date and time
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const bookingStart = new Date(bookingDateObj);
    bookingStart.setHours(startHours, startMinutes, 0, 0);
    const bookingEnd = new Date(bookingStart);
    bookingEnd.setMinutes(bookingEnd.getMinutes() + parseInt(String(durationMinutes)));
    // Check if booking time is within branch operating hours and not in the past
    const bookingDateOnly = new Date(bookingDate);
    bookingDateOnly.setHours(0, 0, 0, 0);
    if ((0, isPastTime_1.isPastTime)(bookingStart, bookingDateOnly)) {
        throw new orderError_1.BookingInPastError();
    }
    // Check duplicate booking in cart
    const duplicateOrder = await orderQuery_1.OrderQuery.findDuplicateOrder(roomAndDeviceId, branchId, userId, bookingStart, bookingEnd);
    if (duplicateOrder) {
        throw new orderError_1.DuplicateBookingError();
    }
    // Calculate pricing
    const pricing = await calculateBookingPrice(branchId, roomAndDeviceId, categoryId, bookingDate, durationMinutes);
    // Check if user already has a cart order, if so, append to it
    const existingCartOrder = await orderRepository_1.OrderRepository.getCartOrder(userId, branchId);
    if (existingCartOrder) {
        // Add new order item to existing cart
        await orderItemRepository_1.OrderItemRepository.create({
            data: {
                orderId: existingCartOrder.id,
                roomAndDeviceId,
                bookingStart,
                bookingEnd,
                durationMinutes,
                price: pricing.totalAmount.toString(),
                baseAmount: pricing.baseAmount.toString(),
                categoryFee: pricing.categoryFee.toString(),
                advanceBookingFee: pricing.advanceBookingFee.toString(),
            },
        });
        const updatedTotal = Number(existingCartOrder.totalAmount) + pricing.totalAmount;
        return orderRepository_1.OrderRepository.update(existingCartOrder.id, {
            totalAmount: updatedTotal,
        });
    }
    // Create order with order items (add to cart)
    return orderRepository_1.OrderRepository.create({
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
exports.addToCartService = addToCartService;
/**
 * Checkout order - Convert cart to pending status
 */
const checkoutOrderService = async (payload) => {
    const { userId, orderId, paymentMethod } = payload;
    // Get order
    const order = await orderRepository_1.OrderRepository.findById(orderId);
    if (!order) {
        throw new orderError_1.OrderNotFoundError();
    }
    // Verify ownership
    if (order.customerId !== userId) {
        throw new orderError_1.UnauthorizedOrderAccessError();
    }
    // Verify order is in cart status
    if (order.status !== "cart") {
        throw new orderError_1.InvalidOrderStatusError();
    }
    // Update order to pending
    const updatedOrder = await orderRepository_1.OrderRepository.update(orderId, {
        status: "pending",
        paymentStatus: client_1.PaymentStatus.pending,
        paymentMethod: paymentMethod || null,
    });
    // Create notification for customer
    try {
        await (0, notificationService_1.createNotificationService)({
            userId,
            type: "order_checkout",
            channel: "email",
            payload: {
                subject: "Order Checkout Successful",
                message: "Pesanan Anda telah berhasil di-checkout. Menunggu konfirmasi dari admin.",
                orderCode: updatedOrder.orderCode,
            },
        });
    }
    catch (error) {
        console.warn("Notification creation skipped:", error);
    }
    return updatedOrder;
};
exports.checkoutOrderService = checkoutOrderService;
/**
 * Get orders - Role-based filtering
 */
const getOrdersService = async (payload) => {
    const { userId, role, branchId, status, skip = 0, take = 10 } = payload;
    const where = {};
    if (role === client_1.UserRole.customer) {
        // Customers can only see their own orders
        where.customerId = userId;
    }
    else if (role === client_1.UserRole.admin || role === client_1.UserRole.owner) {
        // Admins and owners can see orders for their branch
        if (branchId) {
            // Verify access to branch
            await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
            where.branchId = branchId;
        }
        else {
            throw new userError_1.HasNoAccessError();
        }
    }
    else {
        throw new userError_1.HasNoAccessError();
    }
    if (status && status !== "undefined") {
        where.status = status;
    }
    const orders = await orderRepository_1.OrderRepository.findMany(where, skip, take);
    const total = await orderRepository_1.OrderRepository.count(where);
    return { orders, total };
};
exports.getOrdersService = getOrdersService;
/**
 * Get order by ID - Role-based access control
 */
const getOrderByIdService = async (payload) => {
    const { userId, orderId, role, branchId } = payload;
    const order = await orderRepository_1.OrderRepository.findById(orderId);
    if (!order) {
        throw new orderError_1.OrderNotFoundError();
    }
    // Access control
    if (role === client_1.UserRole.customer) {
        // Customers can only access their own orders
        if (order.customerId !== userId) {
            throw new orderError_1.UnauthorizedOrderAccessError();
        }
    }
    else if (role === client_1.UserRole.admin || role === client_1.UserRole.owner) {
        // Admins/owners can access orders from their branch
        if (branchId) {
            await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
            if (order.branchId !== branchId) {
                throw new userError_1.HasNoAccessError();
            }
        }
        else {
            throw new userError_1.HasNoAccessError();
        }
    }
    else {
        throw new userError_1.HasNoAccessError();
    }
    return order;
};
exports.getOrderByIdService = getOrderByIdService;
/**
 * Update order status - Admin/owner only, with proper status transitions
 */
const updateOrderStatusService = async (payload) => {
    const { userId, orderId, newStatus, newPaymentStatus, branchId } = payload;
    // Verify admin/owner access
    const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
    if (!hasAccess) {
        throw new userError_1.HasNoAccessError();
    }
    const order = await orderRepository_1.OrderRepository.findUnique({ id: orderId, branchId });
    if (!order) {
        throw new orderError_1.OrderNotFoundError();
    }
    // Validate order status transitions
    const validOrderTransitions = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["completed", "cancelled"],
        completed: [],
        cancelled: [],
        cart: ["pending"],
    };
    if (!validOrderTransitions[order.status]) {
        throw new orderError_1.InvalidOrderStatusError();
    }
    if (!validOrderTransitions[order.status].includes(newStatus)) {
        throw new orderError_1.InvalidOrderStatusError();
    }
    if (newPaymentStatus) {
        // Validate payment status transitions
        const validPaymentTransitions = {
            unpaid: ["pending", "failed"],
            pending: ["paid", "failed"],
            paid: [],
            failed: ["pending"],
            refund_pending: [],
        };
        if (!validPaymentTransitions[order.paymentStatus]) {
            throw new orderError_1.InvalidPaymentStatusError();
        }
        if (!validPaymentTransitions[order.paymentStatus].includes(newPaymentStatus)) {
            throw new orderError_1.InvalidPaymentStatusError();
        }
    }
    const updatedOrder = await orderRepository_1.OrderRepository.updateStatus(orderId, newStatus, newPaymentStatus);
    // Create notification for customer
    try {
        const statusMessages = {
            confirmed: "Pesanan Anda telah dikonfirmasi",
            completed: "Pesanan Anda telah selesai",
            cancelled: "Pesanan Anda telah dibatalkan",
        };
        await (0, notificationService_1.createNotificationService)({
            userId: order.customerId,
            type: `order_${newStatus}`,
            channel: "email",
            payload: {
                subject: `Order Status Update - ${newStatus}`,
                message: statusMessages[newStatus] ||
                    `Status order berubah menjadi ${newStatus}`,
                orderCode: updatedOrder.orderCode,
            },
        });
    }
    catch (error) {
        console.warn("Notification creation skipped:", error);
    }
    return updatedOrder;
};
exports.updateOrderStatusService = updateOrderStatusService;
/**
 * Cancel order - Admin/owner only, only if payment is invalid
 */
const cancelOrderService = async (payload) => {
    const { userId, orderId, branchId, reason } = payload;
    // Verify admin/owner access
    const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, branchId);
    if (!hasAccess) {
        throw new userError_1.HasNoAccessError();
    }
    const order = await orderRepository_1.OrderRepository.findUnique({ id: orderId, branchId });
    if (!order) {
        throw new orderError_1.OrderNotFoundError();
    }
    // Only allow cancellation for pending or confirmed orders
    if (!["pending", "confirmed"].includes(order.status)) {
        throw new orderError_1.InvalidOrderStatusError();
    }
    // Check payment status - only cancel if payment is unpaid or failed
    if (!["unpaid", "paid", "failed"].includes(order.paymentStatus)) {
        throw new orderError_1.InvalidPaymentStatusError();
    }
    // Use transaction to ensure data consistency
    const updatedOrder = await database_1.prisma.$transaction(async (tx) => {
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
        await (0, notificationService_1.createNotificationService)({
            userId: order.customerId,
            type: "order_cancelled",
            channel: "email",
            payload: {
                subject: "Order Cancelled",
                message: `Pesanan Anda telah dibatalkan. Alasan: ${reason || "Pembayaran tidak valid"}`,
                orderCode: updatedOrder.orderCode,
            },
        });
    }
    catch (error) {
        console.warn("Notification creation skipped:", error);
    }
    return updatedOrder;
};
exports.cancelOrderService = cancelOrderService;
//# sourceMappingURL=orderService.js.map