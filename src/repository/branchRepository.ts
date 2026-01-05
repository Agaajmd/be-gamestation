import { prisma } from "../database";

export const BranchRepository = {
  // Find branch by ID
  findById(branchId: bigint) {
    return prisma.branch.findUnique({ where: { id: branchId } });
  },
};
