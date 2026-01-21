import { prisma } from "../database";

export const BranchHolidayRepository = {
  // Find Many
  findMany(where: object, options?: object) {
    return prisma.branchHoliday.findMany({
      where,
      ...options,
    });
  },

  // Create Many
  createMany(
    data: Array<{
      branchId: bigint;
      date: Date;
      name: string;
      description: string;
    }>,
  ) {
    return prisma.branchHoliday.createMany({
      data,
      skipDuplicates: true,
    });
  },

  // Update Many
  updateMany(where: object, data: object, options?: object) {
    return prisma.branchHoliday.updateMany({
      where,
      data,
      ...options,
    });
  },
};
