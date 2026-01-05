// Repository
import { BranchRepository } from "../../repository/branchRepository";
import { UserRepository } from "../../repository/userRepository";
import { AdminRepository } from "../../repository/adminRepository";
import { AuditLogRepository } from "../../repository/auditLogRepository";

// Error
import { BranchNotFoundError } from "../../errors/BranchError/branchError";
import { UserNotFoundError } from "../../errors/AuthError/authError";
import {
  ExistingAdminError,
  AdminNotFoundError,
} from "../../errors/AdminError/adminError";

// Type
import { AdminRole, UserRole } from "@prisma/client";

// Service function to add a branch admin
export async function addBranchAdminService(payload: {
  branchId: bigint;
  userId: bigint;
  email: string;
  role: AdminRole;
}) {
  const { userId, email } = payload;

  const [branch, user] = await Promise.all([
    BranchRepository.findById(payload.branchId),
    UserRepository.findByEmail(payload.email),
  ]);

  if (!branch) {
    throw new BranchNotFoundError();
  }

  if (!user) {
    throw new UserNotFoundError();
  }

  const existingAdmin = await AdminRepository.findByUserId(user.id);

  if (existingAdmin) {
    throw new ExistingAdminError();
  }

  if (user.role === UserRole.customer) {
    await UserRepository.updateUserRole(user.id, UserRole.admin);
  }

  const admin = await AdminRepository.createAdminWithUserData({
    userId: user.id,
    branchId: payload.branchId,
    role: payload.role,
  });

  await AuditLogRepository.createAuditLog({
    userId,
    action: "ADD_BRANCH_ADMIN",
    entity: "Admin",
    entityId: admin.id,
    meta: {
      branchId: payload.branchId.toString(),
      adminEmail: email,
      role: payload.role,
      timestamp: new Date().toISOString(),
    },
  });

  return admin;
}

// Service function to get branch admins
export async function getBranchAdminsService(branchId: bigint) {
  const branch = await BranchRepository.findById(branchId);

  if (!branch) {
    throw new BranchNotFoundError();
  }

  const admins = await AdminRepository.findByBranchId(branchId);

  return admins;
}

// Service function to update branch admin
export async function updateBranchAdminService(
  adminId: bigint,
  currentBranchId: bigint,
  targetBranchId?: bigint,
  role?: AdminRole
) {
  const admin = await AdminRepository.findById(adminId);

  if (!admin) {
    throw new AdminNotFoundError();
  }

  if (targetBranchId) {
    const BranchIdIsExisting = await BranchRepository.findById(targetBranchId);

    if (!BranchIdIsExisting) {
      throw new BranchNotFoundError();
    }
  }

  const updatedAdmin = await AdminRepository.updateAdmin(adminId, {
    branchId: targetBranchId,
    role,
  });

  await AuditLogRepository.createAuditLog({
    userId: admin.userId,
    action: "UPDATE_BRANCH_ADMIN",
    entity: "Admin",
    entityId: adminId,
    meta: {
      oldBranchId: currentBranchId.toString(),
      newBranchId: targetBranchId?.toString() || admin.branchId.toString(),
      newRole: role || admin.role,
      adminEmail: admin.user.email,
      timestamp: new Date().toISOString(),
    },
  });

  return updatedAdmin;
}

// Service function to remove branch admin
export async function removeBranchAdminService(
  adminId: bigint,
  branchId: bigint,
  userId: bigint
) {
  const admin = await AdminRepository.findById(adminId);

  if (!admin) {
    throw new AdminNotFoundError();
  }

  await AdminRepository.deleteAdminBranch(adminId);

  await UserRepository.updateUserRole(admin.userId, UserRole.customer);

  await AuditLogRepository.createAuditLog({
    userId,
    action: "REMOVE_BRANCH_ADMIN",
    entity: "Admin",
    entityId: adminId,
    meta: {
      branchId: branchId.toString(),
      adminEmail: admin.user.email,
      timestamp: new Date().toISOString(),
    },
  });
}
