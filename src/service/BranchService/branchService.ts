// Repository
import { BranchRepository } from "../../repository/branchRepository";
import { AuditLogRepository } from "../../repository/auditLogRepository";
import { OwnerRepository } from "../../repository/ownerRepository";
import { UserRepository } from "../../repository/userRepository";

// Queries
import { AdminQuery } from "../../queries/adminQuery";

// Error
import { UserNotFoundError } from "../../errors/AuthError/authError";
import { UserNotOwnerError } from "../../errors/UserError/userError";

// Helper
import { updateBranchFacilities } from "../../helper/branchAmenitiesHelper";

// Types
import { UserRole } from "@prisma/client";

// Service function to create a new branch
export async function createBranchService(payload: {
  userId: bigint;
  name: string;
  address: string;
  phone: string;
  timeZone: string;
  openTime: string;
  closeTime: string;
  facilities: string[];
}) {
  const {
    userId,
    name,
    address,
    phone,
    timeZone,
    openTime,
    closeTime,
    facilities,
  } = payload;

  const owner = await OwnerRepository.findByUserId(userId);
  if (!owner) {
    throw new UserNotOwnerError();
  }

  let parsedOpenTime: Date | undefined;
  let parsedCloseTime: Date | undefined;

  if (openTime) {
    parsedOpenTime = new Date(`1970-01-01T${openTime}Z`);
  }
  if (closeTime) {
    parsedCloseTime = new Date(`1970-01-01T${closeTime}Z`);
  }

  const initialAmenities = {
    auto: {
      roomAndDevices: { types: [], versions: [], total: 0 },
      categories: { tiers: [], names: [], total: 0 },
    },
    facilities: facilities || {
      general: [],
      foodAndBeverage: [],
      parking: [],
      entertainment: [],
      accessibility: [],
    },
    lastUpdated: new Date().toISOString(),
  };

  const branch = await BranchRepository.createBranch({
    ownerId: owner.id,
    name,
    address,
    phone,
    timezone: timeZone || "Asia/Jakarta",
    openTime: parsedOpenTime!,
    closeTime: parsedCloseTime!,
    amenities: initialAmenities,
  });

  await AuditLogRepository.createAuditLog({
    userId,
    action: `Created branch ${branch.name}`,
    entity: "Branch",
    entityId: branch.id,
    meta: {
      branchName: branch.name,
      timestamp: new Date(),
    },
  });

  return branch;
}

// Service function to get all branches
export async function getAllBranchesService(userId: bigint) {
  const user = await UserRepository.findByIdUserOnly(userId);
  if (!user) {
    throw new UserNotFoundError();
  }

  let branches;

  if (user.role === UserRole.admin) {
    const admin = await AdminQuery.getAdminWithBranch(userId);
    branches = admin ? [admin.branch] : [];
  } else {
    branches = await BranchRepository.findBranch();
  }

  return branches;
}

// Service function to get branch by ID with authorization
export async function getBranchByIdService(payload: {
  branchId: bigint;
  userId: bigint;
}) {
  const { branchId, userId } = payload;

  const user = await UserRepository.findByIdUserOnly(userId);
  if (!user) {
    throw new UserNotFoundError();
  }

  const branch = await BranchRepository.findBranchWithDetails(branchId);

  if (!branch) {
    throw new Error("Cabang tidak ditemukan");
  }

  return branch;
}

// Service function to update branch
export async function updateBranchService(payload: {
  branchId: bigint;
  userId: bigint;
  name?: string;
  address?: string;
  phone?: string;
  timezone?: string;
  openTime?: string;
  closeTime?: string;
  facilities?: any;
}) {
  const {
    branchId,
    userId,
    name,
    address,
    phone,
    timezone,
    openTime,
    closeTime,
    facilities,
  } = payload;

  // Check if branch exists
  const branch = await BranchRepository.findBranchById(branchId);
  if (!branch) {
    throw new Error("Cabang tidak ditemukan");
  }

  // Parse time if provided
  let parsedOpenTime: Date | undefined;
  let parsedCloseTime: Date | undefined;

  if (openTime) {
    parsedOpenTime = new Date(`1970-01-01T${openTime}Z`);
  }
  if (closeTime) {
    parsedCloseTime = new Date(`1970-01-01T${closeTime}Z`);
  }

  // Update facilities if provided
  if (facilities !== undefined) {
    await updateBranchFacilities(branchId, facilities);
  }

  // Update branch
  const updatedBranch = await BranchRepository.updateBranch(branchId, {
    name: name || branch.name,
    address: address !== null ? address : undefined,
    phone: phone !== null ? phone : undefined,
    timezone: timezone || branch.timezone,
    openTime: parsedOpenTime !== null ? parsedOpenTime : undefined,
    closeTime: parsedCloseTime !== null ? parsedCloseTime : undefined,
  });

  // Log audit
  await AuditLogRepository.createAuditLog({
    userId,
    action: "UPDATE_BRANCH",
    entity: "Branch",
    entityId: branchId,
    meta: {
      changes: {
        branchId: branchId.toString(),
        userId: userId.toString(),
        name,
        address,
        phone,
        timezone,
        openTime,
        closeTime,
        facilities,
      },
      timestamp: new Date().toISOString(),
    },
  });

  return updatedBranch;
}

// Service function to delete branch
export async function deleteBranchService(payload: {
  branchId: bigint;
  userId: bigint;
}) {
  const { branchId, userId } = payload;

  // Check if branch exists
  const branch = await BranchRepository.findBranchWithCounts(branchId);
  if (!branch) {
    throw new Error("Cabang tidak ditemukan");
  }

  // Check if there are active orders
  if (branch._count.orders > 0) {
    throw new Error(
      "Tidak dapat menghapus cabang yang memiliki riwayat order. Silakan hubungi super admin.",
    );
  }

  // Delete branch
  await BranchRepository.deleteBranch(branchId);

  // Log audit
  await AuditLogRepository.createAuditLog({
    userId,
    action: "DELETE_BRANCH",
    entity: "Branch",
    entityId: branchId,
    meta: {
      branchName: branch.name,
      timestamp: new Date().toISOString(),
    },
  });

  return branch;
}
