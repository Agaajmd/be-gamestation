import { prisma } from "../database";

export const AnnouncementRepository = {
  // Find unique announcement
  findUnique(where: any) {
    return prisma.announcement.findUnique({
      where,
    });
  },

  // Find announcement by ID
  findById(id: bigint) {
    return prisma.announcement.findUnique({
      where: { id },
    });
  },

  // Find first announcement matching criteria
  findFirst(where: object, options?: object) {
    return prisma.announcement.findFirst({
      where,
      ...options,
    });
  },

  // Find multiple announcements with pagination
  findMany(where: object, skip?: number, take?: number, orderBy?: object) {
    return prisma.announcement.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || {
        startDate: "desc",
      },
    });
  },

  // Count announcements
  count(where: object) {
    return prisma.announcement.count({ where });
  },

  // Create announcement
  create(data: any) {
    return prisma.announcement.create({
      data,
    });
  },

  // Update announcement
  update(id: bigint, data: any) {
    return prisma.announcement.update({
      where: { id },
      data,
    });
  },

  // Delete announcement
  delete(id: bigint) {
    return prisma.announcement.delete({
      where: { id },
    });
  },

  // Find all active announcements (for public display)
  findActive(branchId?: bigint, skip?: number, take?: number) {
    const now = new Date();
    const where: any = {
      startDate: { lte: now },
      endDate: { gte: now },
    };

    if (branchId) {
      where.OR = [
        { forBranch: branchId },
        { forBranch: null }, // Global announcements
      ];
    }

    return prisma.announcement.findMany({
      where,
      skip,
      take,
      orderBy: {
        startDate: "desc",
      },
    });
  },
};
