"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentService = exports.updatePaymentStatusService = exports.getPaymentByIdService = exports.getPaymentsService = exports.createPaymentService = void 0;
const database_1 = require("../../database");
const paymentRepository_1 = require("../../repository/paymentRepository");
const checkBranchAccessHelper_1 = require("../../helper/checkBranchAccessHelper");
const notificationService_1 = require("../NotificationService/notificationService");
// Error imports
const PaymentNotFoundError_1 = require("../../errors/PaymentError/PaymentNotFoundError");
const InvalidPaymentStatusError_1 = require("../../errors/PaymentError/InvalidPaymentStatusError");
const UnauthorizedPaymentAccessError_1 = require("../../errors/PaymentError/UnauthorizedPaymentAccessError");
const OrderNotFoundError_1 = require("../../errors/PaymentError/OrderNotFoundError");
const DuplicatePaymentError_1 = require("../../errors/PaymentError/DuplicatePaymentError");
/**
 * Create payment (customer/admin/owner)
 */
const createPaymentService = async (payload) => {
    const { userId, role, orderId, amount, method, provider, transactionId, metadata, } = payload;
    // Verify order exists
    const order = await database_1.prisma.order.findUnique({
        where: { id: orderId },
    });
    if (!order) {
        throw new OrderNotFoundError_1.OrderNotFoundError();
    }
    // Check access rights based on role
    if (role === "customer") {
        if (order.customerId !== userId) {
            throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError();
        }
    }
    else if (role === "admin") {
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, order.branchId);
        if (!hasAccess) {
            throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError();
        }
    }
    else if (role === "owner") {
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        const branchIds = owner?.branches.map((b) => b.id) || [];
        if (!branchIds.includes(order.branchId)) {
            throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError();
        }
    }
    // Check if payment already exists
    const existingPayment = await paymentRepository_1.PaymentRepository.findByOrderId(orderId);
    if (existingPayment) {
        throw new DuplicatePaymentError_1.DuplicatePaymentError();
    }
    // Create payment
    const payment = await paymentRepository_1.PaymentRepository.create({
        orderId,
        amount,
        method,
        provider: provider || null,
        status: "pending",
        transactionId: transactionId || null,
        metadata: metadata || null,
    });
    // Send notification to customer
    try {
        await (0, notificationService_1.createNotificationService)({
            userId: order.customerId,
            type: "payment_created",
            channel: "email",
            payload: {
                subject: "Payment Created",
                message: "Payment telah dibuat untuk order Anda. Silakan lakukan pembayaran.",
                orderId: orderId.toString(),
                amount: amount.toString(),
            },
        });
    }
    catch (error) {
        console.warn("Notification creation skipped:", error);
    }
    return payment;
};
exports.createPaymentService = createPaymentService;
/**
 * Get payments (role-based filtering)
 */
const getPaymentsService = async (payload) => {
    const { userId, role, status, branchId, skip = 0, take = 10 } = payload;
    const where = {};
    if (role === "admin") {
        // Admin sees payments only in their branch
        const admin = await database_1.prisma.admin.findUnique({
            where: { userId },
        });
        if (!admin) {
            throw new Error("Admin profile tidak ditemukan");
        }
        where.order = {
            branchId: admin.branchId,
            ...(status && { ...(status && { status: status }) }),
        };
    }
    else if (role === "owner") {
        // Owner sees payments in all their branches
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        if (!owner) {
            throw new Error("Owner profile tidak ditemukan");
        }
        const branchIds = owner.branches.map((b) => b.id);
        where.order = {
            branchId: {
                in: branchIds,
                ...(branchId && { equals: branchId }),
            },
            ...(status && { status: status }),
        };
    }
    else {
        throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError("Hanya admin/owner yang bisa lihat payments");
    }
    if (status) {
        where.status = status;
    }
    const payments = await paymentRepository_1.PaymentRepository.findMany(where, skip, take);
    const total = await paymentRepository_1.PaymentRepository.count(where);
    return { payments, total };
};
exports.getPaymentsService = getPaymentsService;
/**
 * Get payment by ID (role-based access control)
 */
const getPaymentByIdService = async (payload) => {
    const { userId, role, paymentId } = payload;
    const payment = await paymentRepository_1.PaymentRepository.findById(paymentId);
    if (!payment) {
        throw new PaymentNotFoundError_1.PaymentNotFoundError();
    }
    // Check access rights
    if (role === "customer") {
        if (payment.order.customerId !== userId) {
            throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError();
        }
    }
    else if (role === "admin") {
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, payment.order.branchId);
        if (!hasAccess) {
            throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError();
        }
    }
    else if (role === "owner") {
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        const branchIds = owner?.branches.map((b) => b.id) || [];
        if (!branchIds.includes(payment.order.branchId)) {
            throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError();
        }
    }
    return payment;
};
exports.getPaymentByIdService = getPaymentByIdService;
/**
 * Update payment status (admin/owner only)
 */
const updatePaymentStatusService = async (payload) => {
    const { userId, role, paymentId, status, transactionId, paidAt, metadata } = payload;
    // Only admin/owner can update payment
    if (!["admin", "owner"].includes(role)) {
        throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError("Hanya admin/owner yang bisa update payment");
    }
    const payment = await paymentRepository_1.PaymentRepository.findById(paymentId);
    if (!payment) {
        throw new PaymentNotFoundError_1.PaymentNotFoundError();
    }
    // Check access rights
    if (role === "admin") {
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, payment.order.branchId);
        if (!hasAccess) {
            throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError();
        }
    }
    else if (role === "owner") {
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        const branchIds = owner?.branches.map((b) => b.id) || [];
        if (!branchIds.includes(payment.order.branchId)) {
            throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError();
        }
    }
    // Validate status transition
    const validStatuses = ["pending", "paid", "failed", "refund_pending"];
    if (!validStatuses.includes(status)) {
        throw new InvalidPaymentStatusError_1.InvalidPaymentStatusError(`Status ${status} tidak valid. Valid: ${validStatuses.join(", ")}`);
    }
    // Update payment
    const updateData = {
        status: status,
        ...(transactionId && { transactionId }),
        ...(paidAt && { paidAt: new Date(paidAt) }),
        ...(metadata && { metadata }),
    };
    const updatedPayment = await paymentRepository_1.PaymentRepository.update(paymentId, updateData);
    // If payment is marked as paid, update order status to confirmed
    if (status === "paid") {
        await database_1.prisma.order.update({
            where: { id: payment.orderId },
            data: {
                status: "confirmed",
                paymentStatus: "paid",
            },
        });
        // Send notification to customer
        try {
            await (0, notificationService_1.createNotificationService)({
                userId: updatedPayment.order.customerId,
                type: "payment_confirmed",
                channel: "email",
                payload: {
                    subject: "Payment Confirmed",
                    message: "Pembayaran Anda telah dikonfirmasi. Order siap diproses.",
                    orderId: payment.orderId.toString(),
                },
            });
        }
        catch (error) {
            console.warn("Notification creation skipped:", error);
        }
    }
    // If payment failed, send notification
    if (status === "failed") {
        try {
            await (0, notificationService_1.createNotificationService)({
                userId: updatedPayment.order.customerId,
                type: "payment_failed",
                channel: "email",
                payload: {
                    subject: "Payment Failed",
                    message: "Pembayaran gagal. Silakan coba lagi atau gunakan metode pembayaran lain.",
                    orderId: payment.orderId.toString(),
                },
            });
        }
        catch (error) {
            console.warn("Notification creation skipped:", error);
        }
    }
    return updatedPayment;
};
exports.updatePaymentStatusService = updatePaymentStatusService;
/**
 * Delete payment (admin/owner only)
 */
const deletePaymentService = async (payload) => {
    const { userId, role, paymentId } = payload;
    // Only admin/owner can delete payment
    if (!["admin", "owner"].includes(role)) {
        throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError("Hanya admin/owner yang bisa hapus payment");
    }
    const payment = await paymentRepository_1.PaymentRepository.findById(paymentId);
    if (!payment) {
        throw new PaymentNotFoundError_1.PaymentNotFoundError();
    }
    // Check access rights
    if (role === "admin") {
        const hasAccess = await (0, checkBranchAccessHelper_1.checkBranchAccess)(userId, payment.order.branchId);
        if (!hasAccess) {
            throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError();
        }
    }
    else if (role === "owner") {
        const owner = await database_1.prisma.owner.findUnique({
            where: { userId },
            include: { branches: true },
        });
        const branchIds = owner?.branches.map((b) => b.id) || [];
        if (!branchIds.includes(payment.order.branchId)) {
            throw new UnauthorizedPaymentAccessError_1.UnauthorizedPaymentAccessError();
        }
    }
    // Don't allow delete if payment is already paid
    if (payment.status === "paid") {
        throw new Error("Tidak bisa menghapus payment yang sudah dibayar");
    }
    await paymentRepository_1.PaymentRepository.delete(paymentId);
    return { success: true };
};
exports.deletePaymentService = deletePaymentService;
//# sourceMappingURL=paymentService.js.map