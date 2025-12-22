import { Request, Response } from "express";
import { checkBranchAccess } from "../helper/checkBranchAccessHelper";
import prisma from "../lib/prisma";

/**
 * POST /reviews
 * Create review (customer only, for completed orders)
 */
export const createReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const { orderId, rating, comment } = req.body;

    const orderIdBigInt = BigInt(orderId);

    // Verify order exists and belongs to customer
    const order = await prisma.order.findUnique({
      where: { id: orderIdBigInt },
      include: {
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

    // Check if order belongs to customer
    if (order.customerId !== userId) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke order ini",
      });
      return;
    }

    // Check if order is completed
    if (order.status !== "completed") {
      res.status(400).json({
        success: false,
        message: "Review hanya bisa dibuat untuk order yang sudah completed",
      });
      return;
    }

    // Check if review already exists
    if (order.review) {
      res.status(400).json({
        success: false,
        message: "Review untuk order ini sudah ada",
      });
      return;
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        orderId: orderIdBigInt,
        customerId: userId,
        rating,
        comment,
      },
      include: {
        order: {
          select: {
            id: true,
            orderCode: true,
            branch: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const serializedReview = JSON.parse(
      JSON.stringify(review, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(201).json({
      success: true,
      message: "Review berhasil dibuat",
      data: serializedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat review",
    });
  }
};

/**
 * GET /reviews
 * Get reviews list
 * - Customer: see own reviews
 * - Admin: see reviews for their branch
 * - Owner: see all reviews in their branches
 */
export const getReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const { branchId, minRating } = req.query;

    let reviews;

    if (userRole === "customer") {
      // Customer sees their own reviews
      reviews = await prisma.review.findMany({
        where: {
          customerId: userId,
          ...(minRating && { rating: { gte: parseInt(minRating as string) } }),
        },
        include: {
          order: {
            select: {
              id: true,
              orderCode: true,
              bookingStart: true,
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
          createdAt: "desc",
        },
      });
    } else if (userRole === "admin") {
      // Admin sees reviews for their branch
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

      reviews = await prisma.review.findMany({
        where: {
          order: {
            branchId: admin.branchId,
          },
          ...(minRating && { rating: { gte: parseInt(minRating as string) } }),
        },
        include: {
          customer: {
            select: {
              id: true,
              fullname: true,
              email: true,
            },
          },
          order: {
            select: {
              id: true,
              orderCode: true,
              bookingStart: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // Owner sees all reviews in their branches
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

      reviews = await prisma.review.findMany({
        where: {
          order: {
            branchId: {
              in: branchIds,
              ...(branchId && { equals: BigInt(branchId as string) }),
            },
          },
          ...(minRating && { rating: { gte: parseInt(minRating as string) } }),
        },
        include: {
          customer: {
            select: {
              id: true,
              fullname: true,
              email: true,
            },
          },
          order: {
            select: {
              id: true,
              orderCode: true,
              bookingStart: true,
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
          createdAt: "desc",
        },
      });
    }

    const serializedReviews = JSON.parse(
      JSON.stringify(reviews, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedReviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data review",
    });
  }
};

/**
 * GET /reviews/:id
 * Get review by ID
 */
export const getReviewById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const reviewId = BigInt(req.params.id);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        customer: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
        order: {
          include: {
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
          },
        },
      },
    });

    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review tidak ditemukan",
      });
      return;
    }

    // Check access rights
    if (userRole === "customer") {
      if (review.customerId !== userId) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke review ini",
        });
        return;
      }
    } else if (userRole === "admin") {
      const hasAccess = await checkBranchAccess(userId, review.order.branchId);
      if (!hasAccess) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke review ini",
        });
        return;
      }
    } else if (userRole === "owner") {
      const owner = await prisma.owner.findUnique({
        where: { userId },
        include: { branches: true },
      });

      const branchIds = owner?.branches.map((b) => b.id) || [];
      if (!branchIds.includes(review.order.branchId)) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke review ini",
        });
        return;
      }
    }

    const serializedReview = JSON.parse(
      JSON.stringify(review, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serializedReview,
    });
  } catch (error) {
    console.error("Get review by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data review",
    });
  }
};

/**
 * PUT /reviews/:id
 * Update review (customer can only update their own review)
 */
export const updateReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const reviewId = BigInt(req.params.id);
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review tidak ditemukan",
      });
      return;
    }

    // Customer can only update their own review
    if (review.customerId !== userId) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke review ini",
      });
      return;
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(rating && { rating }),
        ...(comment !== undefined && { comment }),
      },
    });

    const serializedReview = JSON.parse(
      JSON.stringify(updatedReview, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      message: "Review berhasil diupdate",
      data: serializedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate review",
    });
  }
};

/**
 * DELETE /reviews/:id
 * Delete review (customer can only delete their own review)
 */
export const deleteReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const reviewId = BigInt(req.params.id);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review tidak ditemukan",
      });
      return;
    }

    // Customer can only delete their own review
    if (review.customerId !== userId) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke review ini",
      });
      return;
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    res.status(200).json({
      success: true,
      message: "Review berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus review",
    });
  }
};
