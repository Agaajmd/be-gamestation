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

  // Find Branch
  findBranch() {
    return prisma.branch.findMany();
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
      },
    });
  },

  // Create new branch
  createBranch(data: {
    ownerId: bigint;
    name: string;
    address: string;
    phone: string;
    timezone: string;
    openTime?: string;
    closeTime?: string;
    amenities?: any;
  }) {
    return prisma.branch.create({
      data: data as any,
    });
  },

  // Find branch with details (owner, devices, admins, counts)
  findBranchWithDetails(branchId: bigint) {
    return prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        owner: {
          include: {
            user: {
              select: {
                fullname: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        roomAndDevices: {
          orderBy: { roomNumber: "asc" },
        },
        admins: {
          include: {
            user: {
              select: {
                fullname: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });
  },

  // Find branch by ID for update/delete operations
  findBranchById(branchId: bigint) {
    return prisma.branch.findUnique({
      where: { id: branchId },
    });
  },

  // Find branch with counts for delete validation
  findBranchWithCounts(branchId: bigint) {
    return prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        _count: {
          select: {
            roomAndDevices: true,
            orders: true,
          },
        },
      },
    });
  },

  // Update branch
  updateBranch(
    branchId: bigint,
    data: {
      name?: string;
      address?: string;
      phone?: string;
      timezone?: string;
      openTime?: string;
      closeTime?: string;
    },
  ) {
    return prisma.branch.update({
      where: { id: branchId },
      data: data as any,
    });
  },

  // Delete branch
  deleteBranch(branchId: bigint) {
    return prisma.branch.delete({
      where: { id: branchId },
    });
  },
};
