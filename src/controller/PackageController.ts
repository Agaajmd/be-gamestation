import { Request, Response } from "express";
import { checkBranchAccess } from "../helper/checkBranchAccessHelper";
import prisma from "../lib/prisma";
import { updateBranchAmenities } from "../helper/branchAmenitiesHelper";

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

    // Auto-update branch amenities
    try {
      await updateBranchAmenities(branchId);
    } catch (error) {
      console.error("Failed to update branch amenities:", error);
    }

    // Convert BigInt to string for JSON serialization
    const serializedPackage = JSON.parse(
      JSON.stringify(packageData, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(201).json({
      success: true,
      message: "Paket berhasil ditambahkan",
      data: serializedPackage,
    });
  } catch (error) {
    console.error("Add package error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan paket",
    });
  }
};
