import { Request, Response } from "express";
import { handleError } from "../helper/responseHelper";
import {
  createPaymentService,
  getPaymentsService,
  getPaymentByIdService,
  updatePaymentStatusService,
  deletePaymentService,
} from "../service/PaymentService/paymentService";

/**
 * Serialize payment for response - BigInt to string conversion
 */
const serializePayment = (payment: any) => {
  return JSON.parse(
    JSON.stringify(payment, (_key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
};

/**
 * POST /payments
 * Create payment record (customer/admin/owner)
 */
export const createPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const { orderId, amount, method, provider, transactionId, metadata } =
      req.body;

    const payment = await createPaymentService({
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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /payments
 * Get payments (role-based filtering - admin/owner only)
 */
export const getPayments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const { status, branchId, skip, take } = req.query;

    const { payments, total } = await getPaymentsService({
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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /payments/:id
 * Get payment by ID (role-based access control)
 */
export const getPaymentById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const paymentId = BigInt(req.params.id);

    const payment = await getPaymentByIdService({
      userId,
      role,
      paymentId,
    });

    res.status(200).json({
      success: true,
      data: serializePayment(payment),
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PUT /payments/:id
 * Update payment status (admin/owner only)
 */
export const updatePayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const paymentId = BigInt(req.params.id);
    const { status, transactionId, paidAt, metadata } = req.body;

    const payment = await updatePaymentStatusService({
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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * DELETE /payments/:id
 * Delete payment (admin/owner only)
 */
export const deletePayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const role = req.user!.role;
    const paymentId = BigInt(req.params.id);

    await deletePaymentService({
      userId,
      role,
      paymentId,
    });

    res.status(200).json({
      success: true,
      message: "Payment berhasil dihapus",
    });
  } catch (error) {
    handleError(error, res);
  }
};
