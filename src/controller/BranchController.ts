import { Request, Response } from "express";
import { prisma } from "../database";
import { formatTime } from "../helper/timeHelper";
import { updateBranchFacilities } from "../helper/branchAmenitiesHelper";

/**
 * Helper function to serialize branch data with formatted times
 */
const serializeBranch = (branch: any) => {
  return {
    ...branch,
    id: branch.id?.toString(),
    ownerId: branch.ownerId?.toString(),
    openTime: formatTime(branch.openTime),
    closeTime: formatTime(branch.closeTime),
  };
};

/**
 * POST /branches
 * Owner membuat cabang baru
 * Required: Owner profile must exist
 */
export const createBranch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const { name, address, phone, timezone, openTime, closeTime, facilities } =
      req.body;

    // Cek apakah user adalah owner
    const owner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!owner) {
      res.status(403).json({
        success: false,
        message: "Anda harus menjadi owner untuk membuat cabang",
      });
      return;
    }

    // Validasi input
    if (!name) {
      res.status(400).json({
        success: false,
        message: "Nama cabang wajib diisi",
      });
      return;
    }

    // Parse time jika ada (format: "HH:MM:SS" atau "HH:MM")
    let parsedOpenTime: Date | undefined;
    let parsedCloseTime: Date | undefined;

    if (openTime) {
      parsedOpenTime = new Date(`1970-01-01T${openTime}Z`);
    }
    if (closeTime) {
      parsedCloseTime = new Date(`1970-01-01T${closeTime}Z`);
    }

    // Initialize amenities structure
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

    // Buat cabang baru
    const branch = await prisma.branch.create({
      data: {
        ownerId: owner.id,
        name,
        address,
        phone,
        timezone: timezone || "Asia/Jakarta",
        openTime: parsedOpenTime,
        closeTime: parsedCloseTime,
        amenities: initialAmenities as any,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "CREATE_BRANCH",
        entity: "Branch",
        entityId: branch.id,
        meta: {
          branchName: name,
          timestamp: new Date().toISOString(),
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Cabang berhasil dibuat",
      data: serializeBranch(branch),
    });
  } catch (error) {
    console.error("Create branch error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat cabang",
    });
  }
};

/**
 * GET /branches
 * Get list cabang (owner melihat cabang miliknya, admin melihat cabang yang dia kelola)
 */
export const getBranches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;

    let branches;

    if (userRole === "owner") {
      // Owner bisa lihat semua cabang
      branches = await prisma.branch.findMany({
        include: {
          owner: {
            include: {
              user: {
                select: {
                  email: true,
                  fullname: true,
                },
              },
            },
          },
          _count: {
            select: {
              roomAndDevices: true,
              orders: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (userRole === "admin") {
      // Admin hanya bisa lihat cabang yang dia kelola
      const admin = await prisma.admin.findUnique({
        where: { userId },
        include: { branch: true },
      });

      branches = admin ? [admin.branch] : [];
    } else {
      // Customer melihat semua cabang yang tersedia (untuk pilihan saat order)
      branches = await prisma.branch.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          timezone: true,
          openTime: true,
          closeTime: true,
          amenities: true,
          _count: {
            select: {
              roomAndDevices: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Serialize branches with proper time formatting
    const serializedBranches = Array.isArray(branches)
      ? branches.map((branch: any) => ({
          ...serializeBranch(branch),
          owner: branch.owner
            ? {
                ...branch.owner,
                id: branch.owner.id?.toString(),
                userId: branch.owner.userId?.toString(),
              }
            : undefined,
        }))
      : [];

    res.status(200).json({
      success: true,
      data: serializedBranches,
    });
  } catch (error) {
    console.error("Get branches error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data cabang",
    });
  }
};

/**
 * GET /branches/:id
 * Get detail cabang
 */
export const getBranchById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;

    const branch = await prisma.branch.findUnique({
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

    if (!branch) {
      res.status(404).json({
        success: false,
        message: "Cabang tidak ditemukan",
      });
      return;
    }

    // Cek authorization
    if (userRole === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { userId },
      });

      if (!admin || admin.branchId !== branchId) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke cabang ini",
        });
        return;
      }
    } else if (userRole === "customer") {
      const owner = await prisma.owner.findUnique({
        where: { userId },
      });

      if (!owner || branch.ownerId !== owner.id) {
        res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses ke cabang ini",
        });
        return;
      }
    }

    // Serialize branch with proper formatting
    const serializedBranch = {
      ...serializeBranch(branch),
      owner: branch.owner
        ? {
            ...branch.owner,
            id: branch.owner.id?.toString(),
            userId: branch.owner.userId?.toString(),
          }
        : undefined,
      roomAndDevices: branch.roomAndDevices?.map((device: any) => ({
        ...device,
        id: device.id?.toString(),
        branchId: device.branchId?.toString(),
      })),
      admins: branch.admins?.map((admin: any) => ({
        ...admin,
        id: admin.id?.toString(),
        userId: admin.userId?.toString(),
        branchId: admin.branchId?.toString(),
      })),
    };

    res.status(200).json({
      success: true,
      data: serializedBranch,
    });
  } catch (error) {
    console.error("Get branch detail error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil detail cabang",
    });
  }
};

/**
 * PUT /branches/:id
 * Update cabang (hanya owner)
 */
export const updateBranch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);
    const { name, address, phone, timezone, openTime, closeTime, facilities } =
      req.body;

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

    // Cek authorization - hanya owner yang bisa update
    const owner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!owner || branch.ownerId !== owner.id) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk mengupdate cabang ini",
      });
      return;
    }

    // Parse time jika ada
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
    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        name: name || branch.name,
        address: address !== undefined ? address : branch.address,
        phone: phone !== undefined ? phone : branch.phone,
        timezone: timezone || branch.timezone,
        openTime:
          parsedOpenTime !== undefined ? parsedOpenTime : branch.openTime,
        closeTime:
          parsedCloseTime !== undefined ? parsedCloseTime : branch.closeTime,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "UPDATE_BRANCH",
        entity: "Branch",
        entityId: branchId,
        meta: {
          changes: req.body,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Serialize updated branch
    res.status(200).json({
      success: true,
      message: "Cabang berhasil diupdate",
      data: serializeBranch(updatedBranch),
    });
  } catch (error) {
    console.error("Update branch error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate cabang",
    });
  }
};

/**
 * DELETE /branches/:id
 * Delete cabang (hanya owner)
 */
export const deleteBranch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);

    // Cek cabang exist
    const branch = await prisma.branch.findUnique({
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

    if (!branch) {
      res.status(404).json({
        success: false,
        message: "Cabang tidak ditemukan",
      });
      return;
    }

    // Cek authorization
    const owner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!owner || branch.ownerId !== owner.id) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk menghapus cabang ini",
      });
      return;
    }

    // Cek apakah ada order aktif
    if (branch._count.orders > 0) {
      res.status(400).json({
        success: false,
        message:
          "Tidak dapat menghapus cabang yang memiliki riwayat order. Silakan hubungi super admin.",
      });
      return;
    }

    // Delete branch (cascade akan menghapus devices, admins)
    await prisma.branch.delete({
      where: { id: branchId },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "DELETE_BRANCH",
        entity: "Branch",
        entityId: branchId,
        meta: {
          branchName: branch.name,
          timestamp: new Date().toISOString(),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Cabang berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete branch error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus cabang",
    });
  }
};
