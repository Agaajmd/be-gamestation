import { Request, Response } from "express";
import { checkBranchAccess } from "../helper/checkBranchAccessHelper";
import prisma from "../lib/prisma";

/**
 * POST /payments
 * Create payment record (customer/admin/owner)
 */
export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const { orderId, amount, method, provider, transactionId, metadata } =
      req.body;

    const orderIdBigInt = BigInt(orderId);

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: orderIdBigInt },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
      return;
    }

    // Check access rights
    if (userRole === "customer" && order.customerId !== userId) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke order ini",
      });
      return;
    } else if (userRole === "admin") {
      const hasAccess = await checkBranchAccess(userId, order.branchId);
      if (!hasAccess) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke order ini",
        });
        return;
      }
    } else if (userRole === "owner") {
      const owner = await prisma.owner.findUnique({
        where: { userId },
        include: { branches: true },
      });

      const branchIds = owner?.branches.map((b) => b.id) || [];
      if (!branchIds.includes(order.branchId)) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke order ini",
        });
        return;
      }
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: orderIdBigInt },
    });

    if (existingPayment) {
      res.status(400).json({
        success: false,
        message: "Payment untuk order ini sudah ada",
      });
      return;
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        orderId: orderIdBigInt,
        amount,
        method,
        provider,
        status: "pending",
        transactionId,
        metadata,
      },
    });

    const serializedPayment = JSON.parse(
      JSON.stringify(payment, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(201).json({
      success: true,
      message: "Payment berhasil dibuat",
      data: serializedPayment,
    });
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat payment",
    });
  }
};

/**
 * GET /payments
 * Get payments list (admin/owner only)
 */
export const getPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const { status, branchId } = req.query;

    let payments;

    if (userRole === "admin") {
      // Admin sees payments in their branch
      const admin = await prisma.admin.findUnique({
        where: { userId },
      });

      if (!admin) {
        res.status(403).json({
          success: false,
          message: "Admin profile tidak ditemukan",
        });
        return;
      }

      payments = await prisma.payment.findMany({
        where: {
          order: {
            branchId: admin.branchId,
          },
          ...(status && { status: status as any }),
        },
        include: {
          order: {
            include: {
              customer: {
                select: {
                  id: true,
                  email: true,
                  fullname: true,
                },
              },
              branch: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      });
    } else {
      // Owner sees all payments in their branches
      const owner = await prisma.owner.findUnique({
        where: { userId },
        include: { branches: true },
      });

      if (!owner) {
        res.status(403).json({
          success: false,
          message: "Owner profile tidak ditemukan",
        });
        return;
      }

      const branchIds = owner.branches.map((b) => b.id);

      payments = await prisma.payment.findMany({
        where: {
          order: {
            branchId: {
              in: branchIds,
              ...(branchId && { equals: BigInt(branchId as string) }),
            },
          },
          ...(status && { status: status as any }),
        },
        include: {
          order: {
            include: {
              customer: {
                select: {
                  id: true,
                  email: true,
                  fullname: true,
                },
              },
              branch: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      });
    }

    const serializedPayments = JSON.parse(
      JSON.stringify(payments, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedPayments,
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data payment",
    });
  }
};

/**
 * GET /payments/:id
 * Get payment by ID
 */
export const getPaymentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const paymentId = BigInt(req.params.id);

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            customer: {
              select: {
                id: true,
                email: true,
                fullname: true,
                phone: true,
              },
            },
            branch: {
              select: {
                id: true,
                name: true,
                address: true,
                phone: true,
              },
            },
            orderItems: {
              include: {
                roomAndDevice: true,
                game: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      res.status(404).json({
        success: false,
        message: "Payment tidak ditemukan",
      });
      return;
    }

    // Check access rights
    if (userRole === "customer") {
      if (payment.order.customerId !== userId) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke payment ini",
        });
        return;
      }
    } else if (userRole === "admin") {
      const hasAccess = await checkBranchAccess(userId, payment.order.branchId);
      if (!hasAccess) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke payment ini",
        });
        return;
      }
    } else if (userRole === "owner") {
      const owner = await prisma.owner.findUnique({
        where: { userId },
        include: { branches: true },
      });

      const branchIds = owner?.branches.map((b) => b.id) || [];
      if (!branchIds.includes(payment.order.branchId)) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke payment ini",
        });
        return;
      }
    }

    const serializedPayment = JSON.parse(
      JSON.stringify(payment, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedPayment,
    });
  } catch (error) {
    console.error("Get payment by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data payment",
    });
  }
};

/**
 * PUT /payments/:id
 * Update payment status (admin/owner only)
 */
export const updatePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const paymentId = BigInt(req.params.id);
    const { status, transactionId, paidAt, metadata } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            customer: {
              select: {
                id: true,
                email: true,
                fullname: true,
                phone: true,
              },
            },
            branch: {
              select: {
                id: true,
                name: true,
                address: true,
                phone: true,
              },
            },
            orderItems: {
              include: {
                roomAndDevice: true,
                game: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      res.status(404).json({
        success: false,
        message: "Payment tidak ditemukan",
      });
      return;
    }

    // Check access rights
    if (userRole === "admin") {
      const hasAccess = await checkBranchAccess(userId, payment.order.branchId);
      if (!hasAccess) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke payment ini",
        });
        return;
      }
    } else if (userRole === "owner") {
      const owner = await prisma.owner.findUnique({
        where: { userId },
        include: { branches: true },
      });

      const branchIds = owner?.branches.map((b) => b.id) || [];
      if (!branchIds.includes(payment.order.branchId)) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke payment ini",
        });
        return;
      }
    }

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        ...(status && { status }),
        ...(transactionId && { transactionId }),
        ...(paidAt && { paidAt: new Date(paidAt) }),
        ...(metadata && { metadata }),
        ...(status === "paid" && !paidAt && { paidAt: new Date() }),
      },
    });

    // If payment status is "paid", update order status and payment status
    if (status === "paid") {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: "paid",
          paymentStatus: "paid",
        },
      });
    }

    const serializedPayment = JSON.parse(
      JSON.stringify(updatedPayment, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      message: "Payment berhasil diupdate",
      data: serializedPayment,
    });
  } catch (error) {
    console.error("Update payment error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate payment",
    });
  }
};
