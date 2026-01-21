import { Request, Response } from "express";

// Services
import {
  createBranchService,
  getAllBranchesService,
  getBranchByIdService,
  updateBranchService,
  deleteBranchService,
} from "../service/BranchService/branchService";

// Error
import { handleError } from "../helper/responseHelper";

/**
 * POST /branches
 * Owner membuat cabang baru
 * Required: Owner profile must exist
 */
export const createBranch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const { name, address, phone, timezone, openTime, closeTime, facilities } =
      req.body;

    const branch = await createBranchService({
      userId,
      name,
      address,
      phone,
      timeZone: timezone,
      openTime,
      closeTime,
      facilities,
    });

    res.status(201).json({
      success: true,
      message: "Cabang berhasil dibuat",
      data: branch,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /branches
 * Get list cabang (owner melihat cabang miliknya, admin melihat cabang yang dia kelola)
 */
export const getBranches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);

    const branches = await getAllBranchesService(userId);

    res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /branches/:id
 * Get detail cabang
 */
export const getBranchById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);

    const branch = await getBranchByIdService({
      branchId,
      userId,
    });

    res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PUT /branches/:id
 * Update cabang (hanya owner)
 */
export const updateBranch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);
    const { name, address, phone, timezone, openTime, closeTime, facilities } =
      req.body;

    const updatedBranch = await updateBranchService({
      branchId,
      userId,
      name,
      address,
      phone,
      timezone,
      openTime,
      closeTime,
      facilities,
    });

    res.status(200).json({
      success: true,
      message: "Cabang berhasil diupdate",
      data: updatedBranch,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * DELETE /branches/:id
 * Delete cabang (hanya owner)
 */
export const deleteBranch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);

    await deleteBranchService({
      branchId,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Cabang berhasil dihapus",
    });
  } catch (error) {
    handleError(error, res);
  }
};
