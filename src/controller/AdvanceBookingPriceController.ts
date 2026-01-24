import { Request, Response } from "express";

// Service
import {
  addAdvanceBookingPriceService,
  updateAdvanceBookingPriceService,
  deleteAdvanceBookingPriceService,
} from "../service/AdvanceBookingPriceService/advanceBookingPriceService";

// Repository
import { AdvanceBookingPriceRepository } from "../repository/advanceBookingPriceRepository";

// Error
import { handleError } from "../helper/responseHelper";

/**
 * POST /advance-booking-price
 * Biaya tambahan untuk booking di muka (berapa hari sebelumnya)
 */
export const addAdvanceBookingPrice = async (req: Request, res: Response) => {
  try {
    const { branchId, minDays, maxDays, additionalFee } = req.body;

    const newAdvanceBookingPrice = await addAdvanceBookingPriceService({
      branchId: BigInt(branchId),
      minDays,
      maxDays,
      additionalFee,
    });

    res.status(200).json({
      success: true,
      data: newAdvanceBookingPrice,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/** GET /advance-booking-prices
 * Mendapatkan semua advance booking prices
 */
export const getAdvanceBookingPrices = async (_req: Request, res: Response) => {
  try {
    const advanceBookingPrices = await AdvanceBookingPriceRepository.findAll();
    res.status(200).json({
      success: true,
      data: advanceBookingPrices,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PUT /advance-booking-price/:id
 * Memperbarui advance booking price berdasarkan ID
 */
export const updateAdvanceBookingPrice = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { minDays, maxDays, additionalFee } = req.body;
    const idBigInt = BigInt(id);

    const updatedAdvanceBookingPrice = await updateAdvanceBookingPriceService({
      id: idBigInt,
      minDays,
      maxDays,
      additionalFee,
    });

    res.status(200).json({
      success: true,
      data: updatedAdvanceBookingPrice,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/** DELETE /advance-booking-price/:id
 * Menghapus advance booking price berdasarkan ID
 */
export const deleteAdvanceBookingPrice = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const idBigInt = BigInt(id);

    await deleteAdvanceBookingPriceService(idBigInt);

    res.status(200).json({
      success: true,
      message: "Advance booking price berhasil dihapus",
    });
  } catch (error) {
    handleError(error, res);
  }
};
