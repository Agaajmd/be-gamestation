import { Request, Response } from "express";
import { checkBranchAccess } from "../helper/checkBranchAccessHelper";
import prisma from "../lib/prisma";
import { updateBranchAmenities } from "../helper/branchAmenitiesHelper";

/**
 * POST /branches/:id/category
 * Owner/admin menambahkan kategori order ke cabang
 */
export const addCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const userId = BigInt(req.user!.userId);
    const { name, description, tier, pricePerHour, amenities } = req.body;

    // Cek authorization
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke cabang ini",
      });
      return;
    }

    // Cek duplicate
    const existing = await prisma.category.findFirst({
      where: {
        branchId,
        name,
        tier,
      },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: "Kategori dengan nama dan tier yang sama sudah ada",
      });
      return;
    }

    // Buat kategori
    const category = await prisma.category.create({
      data: {
        branchId,
        name,
        description,
        tier,
        pricePerHour,
        amenities,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "ADD_CATEGORY",
        entity: "Category",
        entityId: category.id,
        meta: {
          branchId: branchId.toString(),
          name,
          tier,
        },
      },
    });

    // Auto-update branch amenities
    try {
      await updateBranchAmenities(branchId);
    } catch (error) {
      console.error("Failed to update branch amenities:", error);
    }

    const serialized = JSON.parse(
      JSON.stringify(category, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(201).json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data: serialized,
    });
  } catch (error) {
    console.error("Add category error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan kategori",
    });
  }
};

/**
 * GET /branches/:id/category
 * Mendapatkan semua kategori di cabang
 */
export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { deviceType, tier, isActive } = req.query;

    const where: any = { branchId };

    if (deviceType) {
      where.deviceType = deviceType;
    }

    if (tier) {
      where.tier = tier;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: {
            roomAndDevices: true,
          },
        },
      },
      orderBy: [{ tier: "asc" }, { name: "asc" }],
    });

    const serialized = JSON.parse(
      JSON.stringify(categories, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serialized,
    });
  } catch (error) {
    console.error("Get device categories error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil kategori device",
    });
  }
};

/**
 * PUT /branches/:branchId/device-categories/:categoryId
 * Owner/admin mengupdate kategori device
 */
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const categoryId = BigInt(req.params.categoryId);
    const userId = BigInt(req.user!.userId);

    // Cek authorization
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke cabang ini",
      });
      return;
    }

    // Cek kategori exist
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.branchId !== branchId) {
      res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan di cabang ini",
      });
      return;
    }

    // Update
    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: req.body,
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "UPDATE_DEVICE_CATEGORY",
        entity: "DeviceCategory",
        entityId: categoryId,
        meta: {
          branchId: branchId.toString(),
          changes: req.body,
        },
      },
    });

    // Auto-update branch amenities
    try {
      await updateBranchAmenities(branchId);
    } catch (error) {
      console.error("Failed to update branch amenities:", error);
    }

    const serialized = JSON.parse(
      JSON.stringify(updated, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      message: "Kategori device berhasil diupdate",
      data: serialized,
    });
  } catch (error) {
    console.error("Update device category error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate kategori device",
    });
  }
};

/**
 * DELETE /branches/:branchId/device-categories/:categoryId
 * Owner/admin menghapus kategori device
 */
export const deleteDeviceCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const categoryId = BigInt(req.params.categoryId);
    const userId = BigInt(req.user!.userId);

    // Cek authorization
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke cabang ini",
      });
      return;
    }

    // Cek kategori exist
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            roomAndDevices: true,
          },
        },
      },
    });

    if (!category || category.branchId !== branchId) {
      res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan di cabang ini",
      });
      return;
    }

    // Cek apakah ada device yang menggunakan kategori ini
    if (category._count.roomAndDevices > 0) {
      res.status(400).json({
        success: false,
        message:
          "Tidak dapat menghapus kategori yang masih digunakan oleh device",
      });
      return;
    }

    // Delete
    await prisma.category.delete({
      where: { id: categoryId },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "DELETE_DEVICE_CATEGORY",
        entity: "DeviceCategory",
        entityId: categoryId,
        meta: {
          branchId: branchId.toString(),
          categoryName: category.name,
        },
      },
    });

    // Auto-update branch amenities
    try {
      await updateBranchAmenities(branchId);
    } catch (error) {
      console.error("Failed to update branch amenities:", error);
    }

    res.status(200).json({
      success: true,
      message: "Kategori device berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete device category error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus kategori device",
    });
  }
};
