import { Request, Response } from "express";
import prisma from "../lib/prisma";

/**
 * POST /branches/:id/admins
 * Owner menambahkan admin/staff ke cabang
 */
export const addBranchAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);
    const { email, role } = req.body;

    // Cek cabang exist
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      res.status(404).json({
        success: false,
        message: "Cabang tidak ditemukan",
      });
      return;
    }

    // Cari user berdasarkan email
    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      res.status(404).json({
        success: false,
        message: "User dengan email tersebut tidak ditemukan",
      });
      return;
    }

    // Cek apakah user sudah jadi admin di cabang lain
    const existingAdmin = await prisma.admin.findUnique({
      where: { userId: targetUser.id },
    });

    if (existingAdmin) {
      res.status(400).json({
        success: false,
        message: "User sudah menjadi admin di cabang lain",
      });
      return;
    }

    // Update role user menjadi admin jika masih customer
    if (targetUser.role === "customer") {
      await prisma.user.update({
        where: { id: targetUser.id },
        data: { role: "admin" },
      });
    }

    // Buat record admin
    const admin = await prisma.admin.create({
      data: {
        userId: targetUser.id,
        branchId,
        role: role as any,
      },
      include: {
        user: {
          select: {
            email: true,
            fullname: true,
            phone: true,
          },
        },
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "ADD_BRANCH_ADMIN",
        entity: "Admin",
        entityId: admin.id,
        meta: {
          branchId: branchId.toString(),
          adminEmail: email,
          role,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Convert BigInt to string for JSON serialization
    const serializedAdmin = JSON.parse(
      JSON.stringify(admin, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(201).json({
      success: true,
      message: "Admin berhasil ditambahkan",
      data: serializedAdmin,
    });
  } catch (error) {
    console.error("Add branch admin error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan admin",
    });
  }
};

/**
 * GET /branches/:id/admins
 * Owner melihat daftar admin di cabang
 */
export const getBranchAdmins = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);

    // Cek cabang exist
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      res.status(404).json({
        success: false,
        message: "Cabang tidak ditemukan",
      });
      return;
    }

    // Ambil daftar admin
    const admins = await prisma.admin.findMany({
      where: { branchId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullname: true,
            phone: true,
          },
        },
      },
    });

    // Serialize BigInt to string
    const serializedAdmins = admins.map((admin) => ({
      ...admin,
      id: admin.id.toString(),
      userId: admin.userId.toString(),
      branchId: admin.branchId.toString(),
      user: {
        ...admin.user,
        id: admin.user.id.toString(),
      },
    }));

    res.status(200).json({
      success: true,
      data: serializedAdmins,
    });
  } catch (error) {
    console.error("Get branch admins error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil daftar admin",
    });
  }
};

/**
 * PUT /branches/:id/admins/:adminId
 * Owner mengupdate info admin di cabang
 */
export const updateBranchAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currentBranchId = BigInt(req.params.id);
    const adminId = BigInt(req.params.adminId);
    const { role, newBranchId } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      include: { user: true },
    });

    if (!admin || admin.branchId !== currentBranchId) {
      res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan di cabang tersebut",
      });
      return;
    }

    // Jika pindah branch, validasi branch baru
    let targetBranchId = currentBranchId;
    if (newBranchId) {
      targetBranchId = BigInt(newBranchId);

      // Cek branch baru exist
      const newBranch = await prisma.branch.findUnique({
        where: { id: targetBranchId },
      });

      if (!newBranch) {
        res.status(404).json({
          success: false,
          message: "Branch tujuan tidak ditemukan",
        });
        return;
      }
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: {
        ...(role && { role: role as any }),
        ...(targetBranchId !== currentBranchId && { branchId: targetBranchId }),
      },
      include: {
        user: {
          select: {
            email: true,
            fullname: true,
            phone: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: "UPDATE_BRANCH_ADMIN",
        entity: "Admin",
        entityId: adminId,
        meta: {
          oldBranchId: currentBranchId.toString(),
          newBranchId: targetBranchId.toString(),
          newRole: role || admin.role,
          adminEmail: admin.user.email,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Serialize BigInt to string
    const serializedAdmin = {
      ...updatedAdmin,
      id: updatedAdmin.id.toString(),
      userId: updatedAdmin.userId.toString(),
      branchId: updatedAdmin.branchId.toString(),
      branch: {
        ...updatedAdmin.branch,
        id: updatedAdmin.branch.id.toString(),
      },
    };

    res.status(200).json({
      success: true,
      message: "Admin berhasil diupdate",
      data: serializedAdmin,
    });
  } catch (error) {
    console.error("Update branch admin error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate admin",
    });
  }
};

/**
 * DELETE /branches/:id/admins/:adminId
 * Owner menghapus admin dari cabang
 */
export const removeBranchAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.id);
    const adminId = BigInt(req.params.adminId);
    const userId = BigInt(req.user!.userId);

    // Cek admin exist
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      include: { user: true },
    });

    if (!admin || admin.branchId !== branchId) {
      res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
      return;
    }

    // Cek authorization
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    });

    const owner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!owner || branch?.ownerId !== owner.id) {
      res.status(403).json({
        success: false,
        message: "Hanya owner yang dapat menghapus admin",
      });
      return;
    }

    // Delete admin
    await prisma.admin.delete({
      where: { id: adminId },
    });

    // Update role user kembali ke customer jika tidak punya role lain
    await prisma.user.update({
      where: { id: admin.userId },
      data: { role: "customer" },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "REMOVE_BRANCH_ADMIN",
        entity: "Admin",
        entityId: adminId,
        meta: {
          branchId: branchId.toString(),
          adminEmail: admin.user.email,
          timestamp: new Date().toISOString(),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Admin berhasil dihapus",
    });
  } catch (error) {
    console.error("Remove branch admin error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus admin",
    });
  }
};
