import { prisma } from "../database";

// Types
import {
  BranchWithCountRoomAndDevice,
  branchWithCountRoomAndDeviceConfig,
} from "../repository/type/branch/branchWithCountRoomAndDevice";

export const BranchRepository = {
  // Find branch by ID
  findById(branchId: bigint) {
    return prisma.branch.findUnique({ where: { id: branchId } });
  },

  // Find all branches
  findAll(): Promise<BranchWithCountRoomAndDevice[]> {
    return prisma.branch.findMany({
      ...branchWithCountRoomAndDeviceConfig,
      orderBy: { name: "asc" },
    });
  },

  // Find branch by ID just open time and close time
  findOpenAndCloseTimeById(branchId: bigint) {
    return prisma.branch.findUnique({
      where: { id: branchId },
      select: {
        openTime: true,
        closeTime: true,
      },
    });
  },

  // Find all branches with available devices
  findAvailableBranches() {
    return prisma.branch.findMany({
      where: {
        roomAndDevices: {
          some: {
            status: "available",
          },
        },
      }
    })
  },
};
