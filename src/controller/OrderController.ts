import { Request, Response } from "express";
import { checkBranchAccess } from "../helper/checkBranchAccessHelper";
import { isPastDate } from "../helper/bookingAvailability/isPastDate";
import { prisma } from "../database";

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
 * Create new order (customer only) - Add to cart
 */
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const {
      branchId,
      bookingDate: bookingDateStr,
      startTime,
      durationMinutes,
      categoryId,
      roomAndDeviceId,
      notes,
    } = req.body;

    const branchIdBigInt = BigInt(branchId);
    const roomAndDeviceIdBigInt = BigInt(roomAndDeviceId);
    const categoryIdBigInt = categoryId ? BigInt(categoryId) : null;

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

    // Verify device
    const device = await prisma.roomAndDevice.findFirst({
      where: {
        id: roomAndDeviceIdBigInt,
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
        message: "Device tidak ditemukan atau tidak tersedia",
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
          message: "Kategori tidak ditemukan",
        });
        return;
      }
    }

    // Check if booking date is in the past
    const bookingDate = new Date(bookingDateStr);
    if (isPastDate(bookingDate)) {
      res.status(400).json({
        success: false,
        message: "Tanggal booking tidak boleh di masa lalu",
      });
      return;
    }

    // Parse booking date and time
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const bookingStart = new Date(bookingDate);
    bookingStart.setHours(startHours, startMinutes, 0, 0);

    const bookingEnd = new Date(bookingStart);
    bookingEnd.setMinutes(bookingEnd.getMinutes() + parseInt(durationMinutes));

    // Check if booking time is within branch operating hours and not in the past
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDateOnly = new Date(bookingDate);
    bookingDateOnly.setHours(0, 0, 0, 0);

    const isToday = bookingDateOnly.getTime() === today.getTime();

    if (isToday && bookingStart <= now) {
      res.status(400).json({
        success: false,
        message: "Waktu booking tidak boleh di masa lalu",
      });
      return;
    }

    // Check duplicate booking in cart
    const duplicateOrder = await prisma.orderItem.findFirst({
      where: {
        roomAndDeviceId: roomAndDeviceIdBigInt,
        order: {
          branchId: branchIdBigInt,
          customerId: userId,
          status: {
            in: ["pending", "paid", "checked_in", "cart"],
          },
        },
        OR: [
          {
            AND: [
              { bookingStart: { lte: bookingStart } },
              { bookingEnd: { gt: bookingStart } },
            ],
          },
          {
            AND: [
              { bookingStart: { lt: bookingEnd } },
              { bookingEnd: { gte: bookingEnd } },
            ],
          },
          {
            AND: [
              { bookingStart: { gte: bookingStart } },
              { bookingEnd: { lte: bookingEnd } },
            ],
          },
        ],
      },
    });

    if (duplicateOrder) {
      res.status(400).json({
        success: false,
        message: "Device sudah ada di keranjang untuk jadwal yang sama",
      });
      return;
    }

    // Check conflicting bookings
    const conflictingOrder = await prisma.orderItem.findFirst({
      where: {
        roomAndDeviceId: roomAndDeviceIdBigInt,
        order: {
          branchId: branchIdBigInt,
          status: {
            in: ["pending", "paid", "checked_in"],
          },
        },
        OR: [
          {
            AND: [
              { bookingStart: { lte: bookingStart } },
              { bookingEnd: { gt: bookingStart } },
            ],
          },
          {
            AND: [
              { bookingStart: { lt: bookingEnd } },
              { bookingEnd: { gte: bookingEnd } },
            ],
          },
          {
            AND: [
              { bookingStart: { gte: bookingStart } },
              { bookingEnd: { lte: bookingEnd } },
            ],
          },
        ],
      },
    });

    if (conflictingOrder) {
      res.status(400).json({
        success: false,
        message: "Device sudah dibooking untuk jadwal yang dipilih",
      });
      return;
    }

    // Calculate duration and pricing
    const hours = parseInt(durationMinutes) / 60;

    // Base amount from device price
    const baseAmount = Number(device.pricePerHour) * hours;

    // Category fee (handle if category is null)
    const categoryFee = category ? Number(category.pricePerHour) * hours : 0;

    // Advance booking fee
    const bookingDateOnly2 = new Date(bookingDate);
    bookingDateOnly2.setHours(0, 0, 0, 0);
    const daysFromToday = Math.floor(
      (bookingDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
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

    // Check if user already has a cart order, if so, append to it
    const existingCartOrder = await prisma.order.findFirst({
      where: {
        customerId: userId,
        status: "cart",
      },
    });
    if (existingCartOrder) {
      // Add new order item to existing cart
      await prisma.orderItem.create({
        data: {
          orderId: existingCartOrder.id,
          roomAndDeviceId: roomAndDeviceIdBigInt,
          durationMinutes: parseInt(durationMinutes),
          baseAmount,
          categoryFee,
          advanceBookingFee,
          price: totalAmount,
          bookingStart,
          bookingEnd,
        },
      });

      // Update total amount in order
      const updatedTotal = Number(existingCartOrder.totalAmount) + totalAmount;
      await prisma.order.update({
        where: { id: existingCartOrder.id },
        data: { totalAmount: updatedTotal },
      });

      // Serialize existing cart order
      const serializedOrder = JSON.parse(
        JSON.stringify(existingCartOrder, (_key, value) =>
          typeof value === "bigint" ? value.toString() : value,
        ),
      );

      res.status(201).json({
        success: true,
        message: "Order berhasil ditambahkan ke keranjang",
        data: serializedOrder,
      });
      return;
    }

    // Create order with order items (add to cart)
    const orderCode = generateOrderCode();

    const order = await prisma.order.create({
      data: {
        orderCode,
        customerId: userId,
        branchId: branchIdBigInt,
        status: "cart",
        totalAmount,
        paymentMethod: null, // Will be set during checkout
        paymentStatus: "unpaid",
        notes,
        orderItems: {
          create: {
            roomAndDeviceId: roomAndDeviceIdBigInt,
            durationMinutes: parseInt(durationMinutes),
            baseAmount,
            categoryFee,
            advanceBookingFee,
            price: totalAmount,
            bookingStart,
            bookingEnd,
          },
        },
      },
      include: {
        orderItems: {
          include: {
            roomAndDevice: {
              include: {
                category: true,
              },
            },
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
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    res.status(201).json({
      success: true,
      message: "Order berhasil ditambahkan ke keranjang",
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
 * PUT /orders/:id/checkout
 * Checkout order (customer only) - from cart to pending
 */
export const checkoutOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const orderId = BigInt(req.params.id);
    const { paymentMethod } = req.body;

    // Ambil order dengan status cart milik user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.customerId !== userId || order.status !== "cart") {
      res.status(400).json({
        success: false,
        message: "Order tidak valid untuk checkout",
      });
      return;
    }

    // Update status order menjadi pending dan set paymentMethod
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "pending",
        paymentMethod: paymentMethod || null,
        paymentStatus: "paid",
      },
      include: {
        orderItems: {
          include: {
            roomAndDevice: {
              include: {
                category: true,
              },
            },
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

    // Buat notifikasi untuk admin branch terkait (jika ada tabel notifikasi)
    try {
      await prisma.notification.create({
        data: {
          userId: BigInt(req.user!.userId),
          type: "new_order",
          channel: "email",
          payload: {
            subject: "New Order",
            message:
              "Your order has been successfully checked out. Please wait for confirmation.",
            orderCode: updatedOrder.orderCode,
          },
          status: "pending",
          sentAt: new Date(),
        },
      });
    } catch (notifErr) {
      // Lewati error notifikasi jika tabel tidak ada
      console.warn("Notification creation skipped:", notifErr);
    }

    const serializedOrder = JSON.parse(
      JSON.stringify(updatedOrder, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    res.status(200).json({
      success: true,
      message: "Order berhasil di-checkout",
      data: serializedOrder,
    });
  } catch (error) {
    console.error("Checkout order error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat checkout order",
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
              roomAndDevice: {
                include: {
                  category: true,
                },
              },
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
              roomAndDevice: {
                include: {
                  category: true,
                },
              },
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
              roomAndDevice: {
                include: {
                  category: true,
                },
              },
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
        typeof value === "bigint" ? value.toString() : value,
      ),
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
  res: Response,
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
            roomAndDevice: {
              include: {
                category: true,
              },
            },
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
        typeof value === "bigint" ? value.toString() : value,
      ),
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
  res: Response,
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
            roomAndDevice: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    const serializedOrder = JSON.parse(
      JSON.stringify(updatedOrder, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
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
  res: Response,
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
        typeof value === "bigint" ? value.toString() : value,
      ),
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
  res: Response,
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
