"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.updateOrderStatus = exports.getOrderById = exports.getOrders = exports.checkoutOrder = exports.addToCart = void 0;
const responseHelper_1 = require("../helper/responseHelper");
const orderService_1 = require("../service/OrderService/orderService");
/**
 * POST /orders
 * Add to cart - Create new order with cart status (customer only)
 */
const addToCart = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const { branchId, bookingDate, startTime, durationMinutes, categoryId, roomAndDeviceId, notes, } = req.body;
        const order = await (0, orderService_1.addToCartService)({
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
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.addToCart = addToCart;
/**
 * PUT /orders/:id/checkout
 * Checkout order - Convert cart to pending (customer only)
 */
const checkoutOrder = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const orderId = BigInt(req.params.id);
        const { paymentMethod } = req.body;
        const order = await (0, orderService_1.checkoutOrderService)({
            userId,
            orderId,
            paymentMethod,
        });
        res.status(200).json({
            success: true,
            message: "Order berhasil di-checkout",
            data: order,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.checkoutOrder = checkoutOrder;
/**
 * GET /orders
 * Get orders - Role-based filtering
 */
const getOrders = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const { branchId, status, skip, take } = req.query;
        const { orders, total } = await (0, orderService_1.getOrdersService)({
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
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getOrders = getOrders;
/**
 * GET /orders/:id
 * Get order by ID - Role-based access control
 */
const getOrderById = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const orderId = BigInt(req.params.id);
        const role = req.user.role;
        const { branchId } = req.query;
        const order = await (0, orderService_1.getOrderByIdService)({
            userId,
            orderId,
            role,
            branchId: branchId ? BigInt(String(branchId)) : undefined,
        });
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getOrderById = getOrderById;
/**
 * PATCH /orders/:id/status
 * Update order status - Admin/owner only with proper status transitions
 */
const updateOrderStatus = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const orderId = BigInt(req.params.id);
        const { branchId, orderStatus, paymentStatus } = req.body;
        const order = await (0, orderService_1.updateOrderStatusService)({
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
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateOrderStatus = updateOrderStatus;
/**
 * DELETE /orders/:id
 * Cancel order - Admin/owner only, only if payment is invalid
 */
const cancelOrder = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const orderId = BigInt(req.params.id);
        const { branchId, reason } = req.body;
        const order = await (0, orderService_1.cancelOrderService)({
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
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=OrderController.js.map