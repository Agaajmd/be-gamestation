"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayment = exports.updatePayment = exports.getPaymentById = exports.getPayments = exports.createPayment = void 0;
const responseHelper_1 = require("../helper/responseHelper");
const paymentService_1 = require("../service/PaymentService/paymentService");
/**
 * Serialize payment for response - BigInt to string conversion
 */
const serializePayment = (payment) => {
    return JSON.parse(JSON.stringify(payment, (_key, value) => typeof value === "bigint" ? value.toString() : value));
};
/**
 * POST /payments
 * Create payment record (customer/admin/owner)
 */
const createPayment = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const { orderId, amount, method, provider, transactionId, metadata } = req.body;
        const payment = await (0, paymentService_1.createPaymentService)({
            userId,
            role,
            orderId: BigInt(orderId),
            amount,
            method,
            provider,
            transactionId,
            metadata,
        });
        res.status(201).json({
            success: true,
            message: "Payment berhasil dibuat",
            data: serializePayment(payment),
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.createPayment = createPayment;
/**
 * GET /payments
 * Get payments (role-based filtering - admin/owner only)
 */
const getPayments = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const { status, branchId, skip, take } = req.query;
        const { payments, total } = await (0, paymentService_1.getPaymentsService)({
            userId,
            role,
            status: String(status) || undefined,
            branchId: branchId ? BigInt(String(branchId)) : undefined,
            skip: skip ? parseInt(String(skip)) : 0,
            take: take ? parseInt(String(take)) : 10,
        });
        res.status(200).json({
            success: true,
            data: payments.map(serializePayment),
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
exports.getPayments = getPayments;
/**
 * GET /payments/:id
 * Get payment by ID (role-based access control)
 */
const getPaymentById = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const paymentId = BigInt(req.params.id);
        const payment = await (0, paymentService_1.getPaymentByIdService)({
            userId,
            role,
            paymentId,
        });
        res.status(200).json({
            success: true,
            data: serializePayment(payment),
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getPaymentById = getPaymentById;
/**
 * PUT /payments/:id
 * Update payment status (admin/owner only)
 */
const updatePayment = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const paymentId = BigInt(req.params.id);
        const { status, transactionId, paidAt, metadata } = req.body;
        const payment = await (0, paymentService_1.updatePaymentStatusService)({
            userId,
            role,
            paymentId,
            status,
            transactionId,
            paidAt,
            metadata,
        });
        res.status(200).json({
            success: true,
            message: "Payment berhasil diupdate",
            data: serializePayment(payment),
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updatePayment = updatePayment;
/**
 * DELETE /payments/:id
 * Delete payment (admin/owner only)
 */
const deletePayment = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const role = req.user.role;
        const paymentId = BigInt(req.params.id);
        await (0, paymentService_1.deletePaymentService)({
            userId,
            role,
            paymentId,
        });
        res.status(200).json({
            success: true,
            message: "Payment berhasil dihapus",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.deletePayment = deletePayment;
//# sourceMappingURL=PaymentController.js.map