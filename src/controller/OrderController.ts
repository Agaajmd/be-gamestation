import { Request, Response } from "express";
import { checkBranchAccess } from "../helper/checkBranchAccessHelper";
import prisma from "../lib/prisma";

/**
 * Generate unique order code
 */
const generateOrderCode = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

/**
 * POST /orders
 * Create new order (customer only)
 */
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const {
      branchId,
      deviceId,
      categoryId,
      packageId,
      gameId,
      bookingStart,
      bookingEnd,
      paymentMethod,
      notes,
    } = req.body;

    const branchIdBigInt = BigInt(branchId);
    const deviceIdBigInt = BigInt(deviceId);
    const packageIdBigInt = BigInt(packageId);
    const categoryIdBigInt = categoryId ? BigInt(categoryId) : null;
    const gameIdBigInt = gameId ? BigInt(gameId) : null;

    // Verify branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: branchIdBigInt },
    });

    if (!branch) {
      res.status(404).json({
        success: false,
        message: "Branch tidak ditemukan",
      });
      return;
    }

    // Verify package exists
    const pkg = await prisma.package.findFirst({
      where: {
        id: packageIdBigInt,
        OR: [{ branchId: branchIdBigInt }, { branchId: null }],
        isActive: true,
      },
    });

    if (!pkg) {
      res.status(400).json({
        success: false,
        message: "Package tidak ditemukan atau tidak aktif",
      });
      return;
    }

    // Verify device
    const device = await prisma.roomAndDevice.findFirst({
      where: {
        id: deviceIdBigInt,
        branchId: branchIdBigInt,
        status: "available",
      },
      include: {
        category: true,
      },
    });

    if (!device) {
      res.status(400).json({
        success: false,
        message: "Device tidak ditemukan atau tidak aktif",
      });
      return;
    }

    // Verify category if provided
    let category = null;
    if (categoryIdBigInt) {
      category = await prisma.category.findFirst({
        where: {
          id: categoryIdBigInt,
          branchId: branchIdBigInt,
        },
      });

      if (!category) {
        res.status(400).json({
          success: false,
          message: "Kategori tidak ditemukan atau tidak aktif",
        });
        return;
      }
    }

    // Check device availability (no overlapping bookings)
    const overlappingOrder = await prisma.orderItem.findFirst({
      where: {
        roomAndDeviceId: deviceIdBigInt,
        order: {
          branchId: branchIdBigInt,
          status: {
            in: ["pending", "paid", "checked_in"],
          },
          OR: [
            {
              AND: [
                { bookingStart: { lte: new Date(bookingStart) } },
                { bookingEnd: { gt: new Date(bookingStart) } },
              ],
            },
            {
              AND: [
                { bookingStart: { lt: new Date(bookingEnd) } },
                { bookingEnd: { gte: new Date(bookingEnd) } },
              ],
            },
            {
              AND: [
                { bookingStart: { gte: new Date(bookingStart) } },
                { bookingEnd: { lte: new Date(bookingEnd) } },
              ],
            },
          ],
        },
      },
    });

    if (overlappingOrder) {
      res.status(400).json({
        success: false,
        message: "Device sudah dibooking pada waktu tersebut",
      });
      return;
    }

    // Verify game if provided
    if (gameIdBigInt) {
      const game = await prisma.game.findUnique({
        where: { id: gameIdBigInt },
      });

      if (!game) {
        res.status(400).json({
          success: false,
          message: "Game tidak ditemukan",
        });
        return;
      }
    }

    // Calculate pricing
    const durationMinutes = pkg.durationMinutes;
    const hours = durationMinutes / 60;

    // Base amount from device
    const baseAmount = Number(device.pricePerHour) * hours;

    // Category fee
    let categoryFee = 0;
    if (category) {
      categoryFee = Number(category.pricePerHour) * hours;
    }

    // Advance booking fee
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(bookingStart);
    bookingDate.setHours(0, 0, 0, 0);
    const daysFromToday = Math.floor(
      (bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    let advanceBookingFee = 0;
    if (daysFromToday > 0) {
      const advancePrice = await prisma.advanceBookingPrice.findFirst({
        where: {
          branchId: branchIdBigInt,
          daysInAdvance: {
            lte: daysFromToday,
          },
        },
        orderBy: {
          daysInAdvance: "desc",
        },
      });

      if (advancePrice) {
        advanceBookingFee = Number(advancePrice.additionalFee) * hours;
      }
    }

    const totalAmount = baseAmount + categoryFee + advanceBookingFee;

    // Create order with order items
    const orderCode = generateOrderCode();

    const order = await prisma.order.create({
      data: {
        orderCode,
        customerId: userId,
        branchId: branchIdBigInt,
        status: "pending",
        baseAmount,
        categoryFee,
        advanceBookingFee,
        totalAmount,
        bookingStart: new Date(bookingStart),
        bookingEnd: new Date(bookingEnd),
        paymentMethod,
        paymentStatus: "unpaid",
        notes,
        orderItems: {
          create: {
            packageId: packageIdBigInt,
            roomAndDeviceId: deviceIdBigInt,
            gameId: gameIdBigInt,
            durationMinutes: pkg.durationMinutes,
            price: totalAmount,
          },
        },
      },
      include: {
        orderItems: {
          include: {
            package: true,
            roomAndDevice: {
              include: {
                category: true,
              },
            },
            game: true,
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
      },
    });

    const serializedOrder = JSON.parse(
      JSON.stringify(order, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(201).json({
      success: true,
      message: "Order berhasil dibuat",
      data: serializedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat order",
    });
  }
};

/**
 * GET /orders
 * Get orders list
 * - Customer: see own orders
 * - Admin: see orders in their branch
 * - Owner: see all orders in their branches
 */
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const { status, branchId } = req.query;

    let orders;

    if (userRole === "customer") {
      // Customer sees their own orders
      orders = await prisma.order.findMany({
        where: {
          customerId: userId,
          ...(status && { status: status as any }),
          ...(branchId && { branchId: BigInt(branchId as string) }),
        },
        include: {
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
              package: true,
              roomAndDevice: true,
              game: true,
            },
          },
          payment: true,
          session: true,
          review: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (userRole === "admin") {
      // Admin sees orders in their branch
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

      orders = await prisma.order.findMany({
        where: {
          branchId: admin.branchId,
          ...(status && { status: status as any }),
        },
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
            },
          },
          orderItems: {
            include: {
              package: true,
              roomAndDevice: true,
              game: true,
            },
          },
          payment: true,
          session: true,
          review: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // Owner sees all orders in their branches
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

      orders = await prisma.order.findMany({
        where: {
          branchId: { in: branchIds },
          ...(status && { status: status as any }),
          ...(branchId && { branchId: BigInt(branchId as string) }),
        },
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
            },
          },
          orderItems: {
            include: {
              package: true,
              roomAndDevice: true,
              game: true,
            },
          },
          payment: true,
          session: true,
          review: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    const serializedOrders = JSON.parse(
      JSON.stringify(orders, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedOrders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data order",
    });
  }
};

/**
 * GET /orders/:id
 * Get order by ID
 */
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const orderId = BigInt(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
            openTime: true,
            closeTime: true,
          },
        },
        orderItems: {
          include: {
            package: true,
            roomAndDevice: true,
            game: true,
          },
        },
        payment: true,
        session: true,
        review: true,
      },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
      return;
    }

    // Check access rights
    if (userRole === "customer") {
      if (order.customerId !== userId) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke order ini",
        });
        return;
      }
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

    const serializedOrder = JSON.parse(
      JSON.stringify(order, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedOrder,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data order",
    });
  }
};

/**
 * PUT /orders/:id/status
 * Update order status (admin/owner only)
 */
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const orderId = BigInt(req.params.id);
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
      return;
    }

    // Check access rights
    if (userRole === "admin") {
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

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderItems: {
          include: {
            package: true,
            roomAndDevice: true,
            game: true,
          },
        },
      },
    });

    const serializedOrder = JSON.parse(
      JSON.stringify(updatedOrder, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      message: "Status order berhasil diupdate",
      data: serializedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate status order",
    });
  }
};

/**
 * PUT /orders/:id/payment-status
 * Update payment status (admin/owner only)
 */
export const updatePaymentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const orderId = BigInt(req.params.id);
    const { paymentStatus } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
      return;
    }

    // Check access rights
    if (userRole === "admin") {
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

    // Update order payment status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });

    // If payment status is "paid", also update order status to "paid"
    if (paymentStatus === "paid") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "paid" },
      });
    }

    const serializedOrder = JSON.parse(
      JSON.stringify(updatedOrder, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      message: "Status pembayaran berhasil diupdate",
      data: serializedOrder,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate status pembayaran",
    });
  }
};

/**
 * DELETE /orders/:id
 * Cancel order (customer can cancel their own pending orders)
 */
export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const orderId = BigInt(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
      return;
    }

    // Customer can only cancel their own orders
    if (userRole === "customer" && order.customerId !== userId) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke order ini",
      });
      return;
    }

    // Can only cancel pending or unpaid orders
    if (
      !["pending"].includes(order.status) ||
      order.paymentStatus !== "unpaid"
    ) {
      res.status(400).json({
        success: false,
        message:
          "Order yang sudah dibayar atau diproses tidak dapat dibatalkan",
      });
      return;
    }

    // Update order status to cancelled
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "cancelled" },
    });

    res.status(200).json({
      success: true,
      message: "Order berhasil dibatalkan",
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membatalkan order",
    });
  }
};
