import { prisma } from "../../database";
import { PaymentRepository } from "../../repository/paymentRepository";
import { checkBranchAccess } from "../../helper/checkBranchAccessHelper";
import { createNotificationService } from "../NotificationService/notificationService";
import {
  sanitizeNumber,
  sanitizeString,
  sanitizeObject,
} from "../../helper/inputSanitizer";

// Error imports
import { PaymentNotFoundError } from "../../errors/PaymentError/PaymentNotFoundError";
import { InvalidPaymentStatusError } from "../../errors/PaymentError/InvalidPaymentStatusError";
import { UnauthorizedPaymentAccessError } from "../../errors/PaymentError/UnauthorizedPaymentAccessError";
import { OrderNotFoundError } from "../../errors/PaymentError/OrderNotFoundError";
import { DuplicatePaymentError } from "../../errors/PaymentError/DuplicatePaymentError";

/**
 * Create payment (customer/admin/owner)
 */
export const createPaymentService = async (payload: {
  userId: bigint;
  role: string;
  orderId: bigint;
  amount: number;
  method: string;
  provider?: string;
  transactionId?: string;
  metadata?: any;
}) => {
  const {
    userId,
    role,
    orderId,
    amount: rawAmount,
    method,
    provider,
    transactionId: rawTransactionId,
    metadata: rawMetadata,
  } = payload;

  // Sanitize input
  const amount = sanitizeNumber(rawAmount, 0);
  if (amount === null || amount < 0) {
    throw new Error("Invalid amount: must be a non-negative number");
  }
  const transactionId = rawTransactionId
    ? sanitizeString(rawTransactionId)
    : undefined;
  const metadata = rawMetadata ? sanitizeObject(rawMetadata) : undefined;

  // Verify order exists
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new OrderNotFoundError();
  }

  // Check access rights based on role
  if (role === "customer") {
    if (order.customerId !== userId) {
      throw new UnauthorizedPaymentAccessError();
    }
  } else if (role === "admin") {
    const hasAccess = await checkBranchAccess(userId, order.branchId);
    if (!hasAccess) {
      throw new UnauthorizedPaymentAccessError();
    }
  } else if (role === "owner") {
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: { branches: true },
    });

    const branchIds = owner?.branches.map((b) => b.id) || [];
    if (!branchIds.includes(order.branchId)) {
      throw new UnauthorizedPaymentAccessError();
    }
  }

  // Check if payment already exists
  const existingPayment = await PaymentRepository.findByOrderId(orderId);

  if (existingPayment) {
    throw new DuplicatePaymentError();
  }

  // Create payment
  const payment = await PaymentRepository.create({
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
    await createNotificationService({
      userId: order.customerId,
      type: "payment_created",
      channel: "email",
      payload: {
        subject: "Payment Created",
        message:
          "Payment telah dibuat untuk order Anda. Silakan lakukan pembayaran.",
        orderId: orderId.toString(),
        amount: amount.toString(),
      },
    });
  } catch (error) {
    console.warn("Notification creation skipped:", error);
  }

  return payment;
};

/**
 * Get payments (role-based filtering)
 */
export const getPaymentsService = async (payload: {
  userId: bigint;
  role: string;
  status?: string;
  branchId?: bigint;
  skip?: number;
  take?: number;
}) => {
  const {
    userId,
    role,
    status: rawStatus,
    branchId,
    skip = 0,
    take = 10,
  } = payload;

  // Sanitize input
  const status = rawStatus ? sanitizeString(rawStatus) : undefined;

  const where: any = {};

  if (role === "admin") {
    // Admin sees payments only in their branch
    const admin = await prisma.admin.findUnique({
      where: { userId },
    });

    if (!admin) {
      throw new Error("Admin profile tidak ditemukan");
    }

    where.order = {
      branchId: admin.branchId,
      ...(status && { ...(status && { status: status as any }) }),
    };
  } else if (role === "owner") {
    // Owner sees payments in all their branches
    const owner = await prisma.owner.findUnique({
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
      ...(status && { status: status as any }),
    };
  } else {
    throw new UnauthorizedPaymentAccessError(
      "Hanya admin/owner yang bisa lihat payments",
    );
  }

  if (status) {
    where.status = status;
  }

  const payments = await PaymentRepository.findMany(where, skip, take);
  const total = await PaymentRepository.count(where);

  return { payments, total };
};

/**
 * Get payment by ID (role-based access control)
 */
export const getPaymentByIdService = async (payload: {
  userId: bigint;
  role: string;
  paymentId: bigint;
}) => {
  const { userId, role, paymentId } = payload;

  const payment = await PaymentRepository.findById(paymentId);

  if (!payment) {
    throw new PaymentNotFoundError();
  }

  // Check access rights
  if (role === "customer") {
    if (payment.order.customerId !== userId) {
      throw new UnauthorizedPaymentAccessError();
    }
  } else if (role === "admin") {
    const hasAccess = await checkBranchAccess(userId, payment.order.branchId);
    if (!hasAccess) {
      throw new UnauthorizedPaymentAccessError();
    }
  } else if (role === "owner") {
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: { branches: true },
    });

    const branchIds = owner?.branches.map((b) => b.id) || [];
    if (!branchIds.includes(payment.order.branchId)) {
      throw new UnauthorizedPaymentAccessError();
    }
  }

  return payment;
};

/**
 * Update payment status (admin/owner only)
 */
export const updatePaymentStatusService = async (payload: {
  userId: bigint;
  role: string;
  paymentId: bigint;
  status: string;
  transactionId?: string;
  paidAt?: string;
  metadata?: any;
}) => {
  const {
    userId,
    role,
    paymentId,
    status: rawStatus,
    transactionId: rawTransactionId,
    paidAt,
    metadata: rawMetadata,
  } = payload;

  // Sanitize input
  const status = sanitizeString(rawStatus);
  const transactionId = rawTransactionId
    ? sanitizeString(rawTransactionId)
    : undefined;
  const metadata = rawMetadata ? sanitizeObject(rawMetadata) : undefined;

  // Only admin/owner can update payment
  if (!["admin", "owner"].includes(role)) {
    throw new UnauthorizedPaymentAccessError(
      "Hanya admin/owner yang bisa update payment",
    );
  }

  const payment = await PaymentRepository.findById(paymentId);

  if (!payment) {
    throw new PaymentNotFoundError();
  }

  // Check access rights
  if (role === "admin") {
    const hasAccess = await checkBranchAccess(userId, payment.order.branchId);
    if (!hasAccess) {
      throw new UnauthorizedPaymentAccessError();
    }
  } else if (role === "owner") {
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: { branches: true },
    });

    const branchIds = owner?.branches.map((b) => b.id) || [];
    if (!branchIds.includes(payment.order.branchId)) {
      throw new UnauthorizedPaymentAccessError();
    }
  }

  // Validate status transition
  const validStatuses = ["pending", "paid", "failed", "refund_pending"];
  if (!validStatuses.includes(status)) {
    throw new InvalidPaymentStatusError(
      `Status ${status} tidak valid. Valid: ${validStatuses.join(", ")}`,
    );
  }

  // Update payment
  const updateData: any = {
    status: status as any,
    ...(transactionId && { transactionId }),
    ...(paidAt && { paidAt: new Date(paidAt) }),
    ...(metadata && { metadata }),
  };

  const updatedPayment = await PaymentRepository.update(paymentId, updateData);

  // If payment is marked as paid, update order status to confirmed
  if (status === "paid") {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: "confirmed",
        paymentStatus: "paid",
      },
    });

    // Send notification to customer
    try {
      await createNotificationService({
        userId: updatedPayment.order.customerId,
        type: "payment_confirmed",
        channel: "email",
        payload: {
          subject: "Payment Confirmed",
          message: "Pembayaran Anda telah dikonfirmasi. Order siap diproses.",
          orderId: payment.orderId.toString(),
        },
      });
    } catch (error) {
      console.warn("Notification creation skipped:", error);
    }
  }

  // If payment failed, send notification
  if (status === "failed") {
    try {
      await createNotificationService({
        userId: updatedPayment.order.customerId,
        type: "payment_failed",
        channel: "email",
        payload: {
          subject: "Payment Failed",
          message:
            "Pembayaran gagal. Silakan coba lagi atau gunakan metode pembayaran lain.",
          orderId: payment.orderId.toString(),
        },
      });
    } catch (error) {
      console.warn("Notification creation skipped:", error);
    }
  }

  return updatedPayment;
};

/**
 * Delete payment (admin/owner only)
 */
export const deletePaymentService = async (payload: {
  userId: bigint;
  role: string;
  paymentId: bigint;
}) => {
  const { userId, role, paymentId } = payload;

  // Only admin/owner can delete payment
  if (!["admin", "owner"].includes(role)) {
    throw new UnauthorizedPaymentAccessError(
      "Hanya admin/owner yang bisa hapus payment",
    );
  }

  const payment = await PaymentRepository.findById(paymentId);

  if (!payment) {
    throw new PaymentNotFoundError();
  }

  // Check access rights
  if (role === "admin") {
    const hasAccess = await checkBranchAccess(userId, payment.order.branchId);
    if (!hasAccess) {
      throw new UnauthorizedPaymentAccessError();
    }
  } else if (role === "owner") {
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: { branches: true },
    });

    const branchIds = owner?.branches.map((b) => b.id) || [];
    if (!branchIds.includes(payment.order.branchId)) {
      throw new UnauthorizedPaymentAccessError();
    }
  }

  // Don't allow delete if payment is already paid
  if (payment.status === "paid") {
    throw new Error("Tidak bisa menghapus payment yang sudah dibayar");
  }

  await PaymentRepository.delete(paymentId);

  return { success: true };
};
