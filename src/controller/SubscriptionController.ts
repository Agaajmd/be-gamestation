import { Request, Response } from "express";
import { prisma } from "../database";

/**
 * POST /subscriptions
 * Create subscription (owner only)
 */
export const createSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const { plan, price, startsAt, endsAt } = req.body;

    // Verify owner exists
    const owner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!owner) {
      res.status(403).json({
        success: false,
        message: "Owner profile tidak ditemukan",
      });
      return;
    }

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        ownerId: owner.id,
        plan,
        price,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        status: "active",
      },
    });

    const serializedSubscription = JSON.parse(
      JSON.stringify(subscription, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(201).json({
      success: true,
      message: "Subscription berhasil dibuat",
      data: serializedSubscription,
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat subscription",
    });
  }
};

/**
 * GET /subscriptions
 * Get subscriptions
 * - Owner: see own subscriptions
 * - Admin: not allowed (403)
 */
export const getSubscriptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const { status } = req.query;

    if (userRole !== "owner") {
      res.status(403).json({
        success: false,
        message: "Hanya owner yang dapat mengakses subscription",
      });
      return;
    }

    // Get owner
    const owner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!owner) {
      res.status(403).json({
        success: false,
        message: "Owner profile tidak ditemukan",
      });
      return;
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        ownerId: owner.id,
        ...(status && { status: status as any }),
      },
      orderBy: {
        startsAt: "desc",
      },
    });

    const serializedSubscriptions = JSON.parse(
      JSON.stringify(subscriptions, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedSubscriptions,
    });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data subscription",
    });
  }
};

/**
 * GET /subscriptions/:id
 * Get subscription by ID
 */
export const getSubscriptionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const subscriptionId = BigInt(req.params.id);

    if (userRole !== "owner") {
      res.status(403).json({
        success: false,
        message: "Hanya owner yang dapat mengakses subscription",
      });
      return;
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        owner: {
          include: {
            user: {
              select: {
                id: true,
                fullname: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!subscription) {
      res.status(404).json({
        success: false,
        message: "Subscription tidak ditemukan",
      });
      return;
    }

    // Check if subscription belongs to the owner
    const owner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!owner || subscription.ownerId !== owner.id) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke subscription ini",
      });
      return;
    }

    const serializedSubscription = JSON.parse(
      JSON.stringify(subscription, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedSubscription,
    });
  } catch (error) {
    console.error("Get subscription by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data subscription",
    });
  }
};

/**
 * PUT /subscriptions/:id
 * Update subscription (owner only)
 */
export const updateSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const subscriptionId = BigInt(req.params.id);
    const { plan, price, startsAt, endsAt, status } = req.body;

    if (userRole !== "owner") {
      res.status(403).json({
        success: false,
        message: "Hanya owner yang dapat mengupdate subscription",
      });
      return;
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      res.status(404).json({
        success: false,
        message: "Subscription tidak ditemukan",
      });
      return;
    }

    // Check if subscription belongs to the owner
    const owner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!owner || subscription.ownerId !== owner.id) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke subscription ini",
      });
      return;
    }

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        ...(plan && { plan }),
        ...(price && { price }),
        ...(startsAt && { startsAt: new Date(startsAt) }),
        ...(endsAt && { endsAt: new Date(endsAt) }),
        ...(status && { status }),
      },
    });

    const serializedSubscription = JSON.parse(
      JSON.stringify(updatedSubscription, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      message: "Subscription berhasil diupdate",
      data: serializedSubscription,
    });
  } catch (error) {
    console.error("Update subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate subscription",
    });
  }
};

/**
 * DELETE /subscriptions/:id
 * Delete subscription (owner only)
 */
export const deleteSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const subscriptionId = BigInt(req.params.id);

    if (userRole !== "owner") {
      res.status(403).json({
        success: false,
        message: "Hanya owner yang dapat menghapus subscription",
      });
      return;
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      res.status(404).json({
        success: false,
        message: "Subscription tidak ditemukan",
      });
      return;
    }

    // Check if subscription belongs to the owner
    const owner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!owner || subscription.ownerId !== owner.id) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke subscription ini",
      });
      return;
    }

    await prisma.subscription.delete({
      where: { id: subscriptionId },
    });

    res.status(200).json({
      success: true,
      message: "Subscription berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus subscription",
    });
  }
};

/**
 * GET /subscriptions/active
 * Get active subscription for owner
 */
export const getActiveSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;

    if (userRole !== "owner") {
      res.status(403).json({
        success: false,
        message: "Hanya owner yang dapat mengakses subscription",
      });
      return;
    }

    const owner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!owner) {
      res.status(403).json({
        success: false,
        message: "Owner profile tidak ditemukan",
      });
      return;
    }

    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        ownerId: owner.id,
        status: "active",
        endsAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        endsAt: "desc",
      },
    });

    if (!activeSubscription) {
      res.status(404).json({
        success: false,
        message: "Tidak ada subscription aktif",
      });
      return;
    }

    const serializedSubscription = JSON.parse(
      JSON.stringify(activeSubscription, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedSubscription,
    });
  } catch (error) {
    console.error("Get active subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil subscription aktif",
    });
  }
};
