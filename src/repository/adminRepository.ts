import { AdminRole } from "@prisma/client";
import { prisma } from "../database";

// Type
import { adminWithUserConfig, AdminWithUser } from "./type/admin/adminWithUser";
import {
  adminWithUserAndBranchConfig,
  AdminWithUserAndBranch,
} from "./type/admin/adminWithUserAndBranch";

export const AdminRepository = {
  // Find admin by ID
  findById(adminId: bigint): Promise<AdminWithUser | null> {
    return prisma.admin.findUnique({
      where: { id: adminId },
      ...adminWithUserConfig,
    });
  },

  // Find admin by user ID
  findByUserId(userId: bigint) {
    return prisma.admin.findUnique({
      where: { userId },
    });
  },

  // Find admin by branch ID
  findByBranchId(branchId: bigint): Promise<AdminWithUser[]> {
    return prisma.admin.findMany({
      where: { branchId },
      ...adminWithUserConfig,
    });
  },

  // Create new admin with user relation
  createAdminWithUserData(data: {
    userId: bigint;
    branchId: bigint;
    role: AdminRole;
  }): Promise<AdminWithUserAndBranch> {
    return prisma.admin.create({
      data: {
        userId: data.userId,
        branchId: data.branchId,
        role: data.role,
      },
      ...adminWithUserAndBranchConfig,
    });
  },

  updateAdmin(
    adminId: bigint,
    data: {
      branchId?: bigint;
      role?: AdminRole;
    }
  ): Promise<AdminWithUserAndBranch> {
    return prisma.admin.update({
      where: { id: adminId },
      data: {
        ...(data.role && { role: data.role }),
        ...(data.branchId && { branchId: data.branchId }),
      },
      ...adminWithUserAndBranchConfig,
    });
  },

  deleteAdminBranch(adminId: bigint) {
    return prisma.admin.delete({
      where: { id: adminId },
    });
  },
};
