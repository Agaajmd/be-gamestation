import { adminBranchConfig, AdminWithBranch } from "../promise/admin";
import { AdminRepository } from "../repository/adminRepository";

export const AdminQuery = {
  async getAdminWithBranch(userId: bigint): Promise<AdminWithBranch> {
    const result = await AdminRepository.findUnique(
      { userId },
      adminBranchConfig,
    );
    return result as AdminWithBranch;
  },

  async getAdminById(userId: bigint) {
    return await AdminRepository.findUnique({ userId });
  },
};
