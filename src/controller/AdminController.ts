import { Request, Response } from "express";

//Service
import {
  addBranchAdminService,
  getBranchAdminsService,
  updateBranchAdminService,
  removeBranchAdminService,
} from "../service/AdminService/adminService";

// Error
import { handleError } from "../helper/responseHelper";

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

    const result = await addBranchAdminService({
      branchId,
      userId,
      email,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Admin berhasil ditambahkan",
      data: result,
    });
  } catch (error) {
    handleError(error, res);
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

    const admins = await getBranchAdminsService(branchId);

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    handleError(error, res);
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

    const updatedAdmin = await updateBranchAdminService(
      adminId,
      currentBranchId,
      newBranchId,
      role
    );

    res.status(200).json({
      success: true,
      message: "Admin berhasil diupdate",
      data: updatedAdmin,
    });
  } catch (error) {
    handleError(error, res);
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

    await removeBranchAdminService(adminId, branchId, userId);

    res.status(200).json({
      success: true,
      message: "Admin berhasil dihapus",
    });
  } catch (error) {
    handleError(error, res);
  }
};
