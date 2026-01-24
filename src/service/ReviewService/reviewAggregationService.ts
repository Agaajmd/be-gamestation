import { ReviewRepository } from "../../repository/reviewRepository";
import { checkBranchAccess } from "../../helper/checkBranchAccessHelper";
import { prisma } from "../../database";

/**
 * Get review statistics for a branch
 */
export const getBranchReviewStatsService = async (payload: {
  userId: bigint;
  role: string;
  branchId: bigint;
}) => {
  const { userId, role, branchId } = payload;

  // Check access rights
  if (role === "admin") {
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      throw new Error("Anda tidak memiliki akses ke branch ini");
    }
  } else if (role === "owner") {
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: { branches: true },
    });

    const branchIds = owner?.branches.map((b) => b.id) || [];
    if (!branchIds.includes(branchId)) {
      throw new Error("Anda tidak memiliki akses ke branch ini");
    }
  }

  const { stats, ratingDistribution } =
    await ReviewRepository.getAggregateByBranch(branchId);

  const totalCount =
    typeof stats._count === "object" ? stats._count.id : (stats._count as any);

  return {
    totalReviews: totalCount,
    averageRating: stats._avg?.rating
      ? Math.round(stats._avg.rating * 100) / 100
      : 0,
    minRating: stats._min?.rating || 0,
    maxRating: stats._max?.rating || 0,
    ratingDistribution: ratingDistribution.map((rd) => ({
      rating: rd.rating,
      count: typeof rd._count === "object" ? rd._count.id : (rd._count as any),
      percentage:
        totalCount > 0
          ? ((typeof rd._count === "object"
              ? rd._count.id
              : (rd._count as any)) /
              totalCount) *
            100
          : 0,
    })),
  };
};

/**
 * Get review statistics for a customer
 */
export const getCustomerReviewStatsService = async (payload: {
  userId: bigint;
  role: string;
  customerId?: bigint;
}) => {
  const { userId, role, customerId } = payload;

  let targetCustomerId: bigint;

  if (role === "customer") {
    // Customer can only see their own stats
    targetCustomerId = userId;
  } else if (customerId) {
    // Admin/Owner can see other customers' stats (optional)
    targetCustomerId = customerId;
  } else {
    throw new Error("Customer ID diperlukan");
  }

  const stats = await ReviewRepository.getAggregateByCustomer(targetCustomerId);

  const totalCount =
    typeof stats._count === "object" ? stats._count.id : (stats._count as any);

  return {
    totalReviews: totalCount,
    averageRating: stats._avg?.rating
      ? Math.round(stats._avg.rating * 100) / 100
      : 0,
  };
};

/**
 * Get top rated reviews for a branch
 */
export const getTopRatedReviewsService = async (payload: {
  userId: bigint;
  role: string;
  branchId: bigint;
  limit?: number;
}) => {
  const { userId, role, branchId, limit = 5 } = payload;

  // Check access rights
  if (role === "admin") {
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      throw new Error("Anda tidak memiliki akses ke branch ini");
    }
  } else if (role === "owner") {
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: { branches: true },
    });

    const branchIds = owner?.branches.map((b) => b.id) || [];
    if (!branchIds.includes(branchId)) {
      throw new Error("Anda tidak memiliki akses ke branch ini");
    }
  }

  const reviews = await ReviewRepository.findMany(
    {
      branchId: branchId,
      rating: {
        gte: 4,
      },
    },
    0,
    limit,
  );

  return reviews;
};

/**
 * Get low rated reviews for a branch (for improvement tracking)
 */
export const getLowRatedReviewsService = async (payload: {
  userId: bigint;
  role: string;
  branchId: bigint;
  limit?: number;
}) => {
  const { userId, role, branchId, limit = 5 } = payload;

  // Check access rights
  if (role === "admin") {
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      throw new Error("Anda tidak memiliki akses ke branch ini");
    }
  } else if (role === "owner") {
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: { branches: true },
    });

    const branchIds = owner?.branches.map((b) => b.id) || [];
    if (!branchIds.includes(branchId)) {
      throw new Error("Anda tidak memiliki akses ke branch ini");
    }
  }

  const reviews = await ReviewRepository.findMany(
    {
      branchId: branchId,
      rating: {
        lte: 2,
      },
    },
    0,
    limit,
  );

  return reviews;
};

/**
 * Get recent reviews for a branch
 */
export const getRecentReviewsService = async (payload: {
  userId: bigint;
  role: string;
  branchId: bigint;
  limit?: number;
}) => {
  const { userId, role, branchId, limit = 10 } = payload;

  // Check access rights
  if (role === "admin") {
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      throw new Error("Anda tidak memiliki akses ke branch ini");
    }
  } else if (role === "owner") {
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: { branches: true },
    });

    const branchIds = owner?.branches.map((b) => b.id) || [];
    if (!branchIds.includes(branchId)) {
      throw new Error("Anda tidak memiliki akses ke branch ini");
    }
  }

  const reviews = await ReviewRepository.findMany(
    {
      branchId: branchId,
    },
    0,
    limit,
  );

  return reviews;
};
