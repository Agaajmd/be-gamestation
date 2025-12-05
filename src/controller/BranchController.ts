import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

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
    const { name, address, phone, timezone, openTime, closeTime } = req.body;

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
      parsedOpenTime = new Date(`1970-01-01T${openTime}`);
    }
    if (closeTime) {
      parsedCloseTime = new Date(`1970-01-01T${closeTime}`);
    }

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
      data: {
        ...branch,
        id: branch.id.toString(),
        ownerId: branch.ownerId.toString(),
      },
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

    if (userRole === "super_admin") {
      // Super admin bisa lihat semua cabang
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
              devices: true,
              packages: true,
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
      // Owner melihat cabangnya sendiri
      const owner = await prisma.owner.findUnique({
        where: { userId },
        include: {
          branches: {
            include: {
              _count: {
                select: {
                  devices: true,
                  packages: true,
                  orders: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      branches = owner?.branches || [];
    }

    res.status(200).json({
      success: true,
      data: branches,
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
        devices: {
          orderBy: { code: "asc" },
        },
        packages: {
          where: { isActive: true },
          orderBy: { price: "asc" },
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

    res.status(200).json({
      success: true,
      data: branch,
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
    const { name, address, phone, timezone, openTime, closeTime } = req.body;

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
      parsedOpenTime = new Date(`1970-01-01T${openTime}`);
    }
    if (closeTime) {
      parsedCloseTime = new Date(`1970-01-01T${closeTime}`);
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

    res.status(200).json({
      success: true,
      message: "Cabang berhasil diupdate",
      data: updatedBranch,
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
            devices: true,
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

    // Delete branch (cascade akan menghapus devices, packages, admins)
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

    // Validasi input
    if (!email || !role) {
      res.status(400).json({
        success: false,
        message: "Email dan role wajib diisi",
      });
      return;
    }

    if (!["staff", "manager"].includes(role)) {
      res.status(400).json({
        success: false,
        message: "Role harus staff atau manager",
      });
      return;
    }

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

    // Cek authorization - hanya owner
    const owner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!owner || branch.ownerId !== owner.id) {
      res.status(403).json({
        success: false,
        message: "Hanya owner yang dapat menambahkan admin",
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

    res.status(201).json({
      success: true,
      message: "Admin berhasil ditambahkan",
      data: admin,
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

/**
 * POST /branches/:id/devices
 * Owner/staff menambahkan device ke cabang
 */
export const addDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const branchId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);
    const { code, type, specs, status } = req.body;

    // Validasi input
    if (!code || !type) {
      res.status(400).json({
        success: false,
        message: "Code dan type wajib diisi",
      });
      return;
    }

    const validTypes = ["ps", "racing", "vr", "pc", "arcade"];
    if (!validTypes.includes(type)) {
      res.status(400).json({
        success: false,
        message: `Type harus salah satu dari: ${validTypes.join(", ")}`,
      });
      return;
    }

    // Cek authorization
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke cabang ini",
      });
      return;
    }

    // Cek duplicate code dalam branch
    const existingDevice = await prisma.device.findFirst({
      where: {
        branchId,
        code,
      },
    });

    if (existingDevice) {
      res.status(400).json({
        success: false,
        message: "Kode device sudah digunakan di cabang ini",
      });
      return;
    }

    // Buat device
    const device = await prisma.device.create({
      data: {
        branchId,
        code,
        type: type as any,
        specs: specs || null,
        status: status || "active",
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "ADD_DEVICE",
        entity: "Device",
        entityId: device.id,
        meta: {
          branchId: branchId.toString(),
          code,
          type,
          timestamp: new Date().toISOString(),
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Device berhasil ditambahkan",
      data: device,
    });
  } catch (error) {
    console.error("Add device error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan device",
    });
  }
};

/**
 * POST /branches/:id/packages
 * Owner/staff menambahkan paket ke cabang
 */
export const addPackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);
    const { name, durationMinutes, price, isActive } = req.body;

    // Validasi input
    if (!name || !durationMinutes || !price) {
      res.status(400).json({
        success: false,
        message: "Name, durationMinutes, dan price wajib diisi",
      });
      return;
    }

    if (durationMinutes <= 0) {
      res.status(400).json({
        success: false,
        message: "Durasi harus lebih dari 0 menit",
      });
      return;
    }

    if (parseFloat(price) <= 0) {
      res.status(400).json({
        success: false,
        message: "Harga harus lebih dari 0",
      });
      return;
    }

    // Cek authorization
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke cabang ini",
      });
      return;
    }

    // Buat package
    const packageData = await prisma.package.create({
      data: {
        branchId,
        name,
        durationMinutes: parseInt(durationMinutes),
        price: parseFloat(price),
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "ADD_PACKAGE",
        entity: "Package",
        entityId: packageData.id,
        meta: {
          branchId: branchId.toString(),
          name,
          price,
          timestamp: new Date().toISOString(),
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Paket berhasil ditambahkan",
      data: packageData,
    });
  } catch (error) {
    console.error("Add package error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan paket",
    });
  }
};

/**
 * Helper function untuk cek akses ke branch
 * Return true jika user adalah owner atau admin/staff dari branch
 */
async function checkBranchAccess(
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
