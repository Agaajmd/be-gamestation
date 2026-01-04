import { Request, Response } from "express";
import { prisma } from "../database";

/**
 * POST /advance-booking-price
 * Biaya tambahan untuk booking di muka (berapa hari sebelumnya)
 */
export const addAdvanceBookingPrice = async (req: Request, res: Response) => {
  try {
    const { branchId, daysInAdvance, additionalFee } = req.body;

    const branchIdBigInt = BigInt(branchId);
    const branch = await prisma.branch.findUnique({
      where: { id: branchIdBigInt },
    });

    if (!branch) {
      res.status(404).json({
        success: false,
        message: "Branch tidak ditemukan",
      });
      return;
    }

    const existing = await prisma.advanceBookingPrice.findFirst({
      where: {
        branchId: branchIdBigInt,
        daysInAdvance,
      },
    });

    if (existing) {
      res.status(400).json({
        message: "Harga untuk branch & days_in_advance ini sudah ada",
      });
      return
    }

    const newAdvanceBookingPrice = await prisma.advanceBookingPrice.create({
      data: {
        branchId: branchIdBigInt,
        daysInAdvance,
        additionalFee,
      },
    });

    res.status(200).json({
      success: true,
      data: newAdvanceBookingPrice,
    });
  } catch (error) {
    console.error("Add AdvanceBookingPrice error:", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

/** GET /advance-booking-prices
 * Mendapatkan semua advance booking prices
 */
export const getAdvanceBookingPrices = async (_req: Request, res: Response) => {
  try {
    const advanceBookingPrices = await prisma.advanceBookingPrice.findMany({
      include: {
        branch: true,
      },
    });
    res.status(200).json({
      success: true,
      data: advanceBookingPrices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

/**
 * PUT /advance-booking-price/:id
 * Memperbarui advance booking price berdasarkan ID
 */
export const updateAdvanceBookingPrice = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { daysInAdvance, additionalFee } = req.body;
    const idBigInt = BigInt(id);

    const advanceBookingPrice = await prisma.advanceBookingPrice.findUnique({
      where: { id: idBigInt },
    });
    if (!advanceBookingPrice) {
      res.status(404).json({
        success: false,
        message: "Advance booking price tidak ditemukan",
      });
      return;
    }

    const updatedAdvanceBookingPrice = await prisma.advanceBookingPrice.update({
      where: { id: idBigInt },
      data: { daysInAdvance, additionalFee },
    });

    res.status(200).json({
      success: true,
      data: updatedAdvanceBookingPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

/** DELETE /advance-booking-price/:id
 * Menghapus advance booking price berdasarkan ID
 */
export const deleteAdvanceBookingPrice = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const idBigInt = BigInt(id);
    const advanceBookingPrice = await prisma.advanceBookingPrice.findUnique({
      where: { id: idBigInt },
    });
    if (!advanceBookingPrice) {
      res.status(404).json({
        success: false,
        message: "Advance booking price tidak ditemukan",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};
