import { Request, Response } from "express";
import { checkBranchAccess } from "../helper/checkBranchAccessHelper";
import prisma from "../lib/prisma";

/**
 * POST /sessions
 * Start a new session (admin only)
 */
export const createSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const { orderId, deviceId } = req.body;

    const orderIdBigInt = BigInt(orderId);
    const deviceIdBigInt = BigInt(deviceId);

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: orderIdBigInt },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
      return;
    }

    // Check if order is paid
    if (order.status !== "paid" && order.status !== "checked_in") {
      res.status(400).json({
        success: false,
        message:
          "Order harus dalam status paid atau checked_in untuk memulai session",
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

    // Verify device exists and belongs to the same branch
    const device = await prisma.roomAndDevice.findFirst({
      where: {
        id: deviceIdBigInt,
        branchId: order.branchId,
      },
    });

    if (!device) {
      res.status(404).json({
        success: false,
        message: "Device tidak ditemukan di branch yang sama",
      });
      return;
    }

    // Check if session already exists for this order
    const existingSession = await prisma.session.findUnique({
      where: { orderId: orderIdBigInt },
    });

    if (existingSession) {
      res.status(400).json({
        success: false,
        message: "Session untuk order ini sudah ada",
      });
      return;
    }

    // Check if device is currently in use
    const activeSession = await prisma.session.findFirst({
      where: {
        roomAndDeviceId: deviceIdBigInt,
        status: "running",
      },
    });

    if (activeSession) {
      res.status(400).json({
        success: false,
        message: "Device sedang digunakan untuk session lain",
      });
      return;
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        orderId: orderIdBigInt,
        roomAndDeviceId: deviceIdBigInt,
        startedAt: new Date(),
        status: "running",
      },
      include: {
        order: {
          include: {
            customer: {
              select: {
                id: true,
                fullname: true,
                email: true,
              },
            },
          },
        },
        roomAndDevice: true,
      },
    });

    // Update order status to checked_in
    await prisma.order.update({
      where: { id: orderIdBigInt },
      data: { status: "checked_in" },
    });

    const serializedSession = JSON.parse(
      JSON.stringify(session, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(201).json({
      success: true,
      message: "Session berhasil dimulai",
      data: serializedSession,
    });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memulai session",
    });
  }
};

/**
 * GET /sessions
 * Get sessions list (admin/owner only)
 */
export const getSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const { status, branchId, deviceId } = req.query;

    let sessions;

    if (userRole === "admin") {
      // Admin sees sessions in their branch
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

      sessions = await prisma.session.findMany({
        where: {
          order: {
            branchId: admin.branchId,
          },
          ...(status && { status: status as any }),
          ...(deviceId && { roomAndDeviceId: BigInt(deviceId as string) }),
        },
        include: {
          order: {
            include: {
              customer: {
                select: {
                  id: true,
                  fullname: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
          roomAndDevice: true,
        },
        orderBy: {
          startedAt: "desc",
        },
      });
    } else {
      // Owner sees all sessions in their branches
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

      sessions = await prisma.session.findMany({
        where: {
          order: {
            branchId: {
              in: branchIds,
              ...(branchId && { equals: BigInt(branchId as string) }),
            },
          },
          ...(status && { status: status as any }),
          ...(deviceId && { roomAndDeviceId: BigInt(deviceId as string) }),
        },
        include: {
          order: {
            include: {
              customer: {
                select: {
                  id: true,
                  fullname: true,
                  email: true,
                  phone: true,
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
          roomAndDevice: true,
        },
        orderBy: {
          startedAt: "desc",
        },
      });
    }

    const serializedSessions = JSON.parse(
      JSON.stringify(sessions, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedSessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data session",
    });
  }
};

/**
 * GET /sessions/:id
 * Get session by ID
 */
export const getSessionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const sessionId = BigInt(req.params.id);

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        order: {
          include: {
            customer: {
              select: {
                id: true,
                fullname: true,
                email: true,
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
        roomAndDevice: true,
      },
    });

    if (!session) {
      res.status(404).json({
        success: false,
        message: "Session tidak ditemukan",
      });
      return;
    }

    // Check access rights
    if (userRole === "customer") {
      if (session.order.customerId !== userId) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke session ini",
        });
        return;
      }
    } else if (userRole === "admin") {
      const hasAccess = await checkBranchAccess(userId, session.order.branchId);
      if (!hasAccess) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke session ini",
        });
        return;
      }
    } else if (userRole === "owner") {
      const owner = await prisma.owner.findUnique({
        where: { userId },
        include: { branches: true },
      });

      const branchIds = owner?.branches.map((b) => b.id) || [];
      if (!branchIds.includes(session.order.branchId)) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke session ini",
        });
        return;
      }
    }

    const serializedSession = JSON.parse(
      JSON.stringify(session, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedSession,
    });
  } catch (error) {
    console.error("Get session by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data session",
    });
  }
};

/**
 * PUT /sessions/:id
 * Update session (stop session) (admin/owner only)
 */
export const updateSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const sessionId = BigInt(req.params.id);
    const { status, endedAt } = req.body;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { order: true },
    });

    if (!session) {
      res.status(404).json({
        success: false,
        message: "Session tidak ditemukan",
      });
      return;
    }

    // Check access rights
    if (userRole === "admin") {
      const hasAccess = await checkBranchAccess(userId, session.order.branchId);
      if (!hasAccess) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke session ini",
        });
        return;
      }
    } else if (userRole === "owner") {
      const owner = await prisma.owner.findUnique({
        where: { userId },
        include: { branches: true },
      });

      const branchIds = owner?.branches.map((b) => b.id) || [];
      if (!branchIds.includes(session.order.branchId)) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke session ini",
        });
        return;
      }
    }

    // Update session
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        ...(status && { status }),
        ...(endedAt && { endedAt: new Date(endedAt) }),
        ...(status === "stopped" && !endedAt && { endedAt: new Date() }),
      },
    });

    // If session is stopped, update order status to completed
    if (status === "stopped") {
      await prisma.order.update({
        where: { id: session.orderId },
        data: { status: "completed" },
      });
    }

    const serializedSession = JSON.parse(
      JSON.stringify(updatedSession, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      message: "Session berhasil diupdate",
      data: serializedSession,
    });
  } catch (error) {
    console.error("Update session error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate session",
    });
  }
};
