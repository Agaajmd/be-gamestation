import { prisma } from "../database";

const reviewInclude = {
  branch: {
    select: {
      id: true,
      name: true,
    },
  },
  customer: {
    select: {
      id: true,
      email: true,
      fullname: true,
    },
  },
} as const;

export const ReviewRepository = {
  // Find review by ID
  findById(reviewId: bigint) {
    return prisma.review.findUnique({
      where: { id: reviewId },
      include: reviewInclude,
    });
  },

  // Find review by customer and branch (for duplicate check)
  findByCustomerAndBranch(customerId: bigint, branchId: bigint) {
    return prisma.review.findFirst({
      where: {
        customerId,
        branchId,
      },
      include: reviewInclude,
    });
  },

  // Find many reviews with filters
  findMany(where: any, skip?: number, take?: number) {
    return prisma.review.findMany({
      where,
      include: reviewInclude,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  // Count reviews
  count(where: any) {
    return prisma.review.count({ where });
  },

  // Find first matching criteria
  findFirst(where: any) {
    return prisma.review.findFirst({
      where,
      include: reviewInclude,
    });
  },

  // Create review
  create(data: any) {
    return prisma.review.create({
      data,
      include: reviewInclude,
    });
  },

  // Update review
  update(reviewId: bigint, data: any) {
    return prisma.review.update({
      where: { id: reviewId },
      data,
      include: reviewInclude,
    });
  },

  // Delete review
  delete(reviewId: bigint) {
    return prisma.review.delete({
      where: { id: reviewId },
    });
  },

  // Get aggregated stats by branch
  async getAggregateByBranch(branchId: bigint) {
    const result = await prisma.review.aggregate({
      where: {
        branchId: branchId,
      } as any,
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
      _min: {
        rating: true,
      },
      _max: {
        rating: true,
      },
    });

    // Get rating distribution
    const ratingCounts = await prisma.review.groupBy({
      by: ["rating"],
      where: {
        branchId: branchId,
      } as any,
      _count: {
        id: true,
      },
    });

    return {
      stats: result,
      ratingDistribution: ratingCounts,
    };
  },

  // Get aggregated stats by customer
  async getAggregateByCustomer(customerId: bigint) {
    const result = await prisma.review.aggregate({
      where: {
        customerId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    return result;
  },
};
