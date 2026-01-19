import { Request, Response } from "express";
import { formatTime } from "../helper/timeHelper";

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
      data: serializeBranch(branch),
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
      branchId, userId
    });

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
      data: serializeBranch(updatedBranch),
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
