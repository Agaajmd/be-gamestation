import prisma from "../lib/prisma";

/**
 * Helper function untuk cek akses ke branch
 * Return true jika user adalah owner atau admin/staff dari branch
 */
export async function checkBranchAccess(
  userId: bigint,
  branchId: bigint
): Promise<boolean> {
  // Cek apakah user adalah owner dari branch
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
  });

  if (!branch) return false;

  const owner = await prisma.owner.findUnique({
    where: { userId },
  });

  if (owner && branch.ownerId === owner.id) {
    return true;
  }

  // Cek apakah user adalah admin/staff dari branch
  const admin = await prisma.admin.findUnique({
    where: { userId },
  });

  if (admin && admin.branchId === branchId) {
    return true;
  }

  return false;
}
