import { Router } from "express";
import * as AdminController from "../controller/AdminController";
import { authenticateToken } from "../middleware/authMiddleware";
import * as roleMiddleware from "../middleware/roleMiddleware";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import { addAdminSchema, updateAdminSchema } from "../validation/bodyValidation/adminValidation";

const router = Router();

/**
 * @route   POST /branches/:id/admins
 * @desc    Owner menambahkan admin/staff ke cabang
 * @access  Private (Owner)
 */
router.post(
  "/:id/admins",
  authenticateToken,
  roleMiddleware.requireOwner,
  ValidateMiddleware.validateBody(addAdminSchema),
  AdminController.addBranchAdmin
);

/**
 * @route   GET /branches/:id/admins
 * @desc    Owner melihat daftar admin di cabang
 * @access  Private (Owner)
 */
router.get(
  "/:branchId/admins",
  authenticateToken,
  roleMiddleware.requireOwner,
  AdminController.getBranchAdmins
);

/**
 * @route   PUT /branches/:id/admins/:adminId
 * @desc    Owner mengupdate info admin di cabang
 * @access  Private (Owner)
 */
router.put(
  "/:id/admins/:adminId",
  authenticateToken,
  roleMiddleware.requireOwner,
  ValidateMiddleware.validateBody(updateAdminSchema),
  AdminController.updateBranchAdmin
);

/**
 * @route   DELETE /branches/:id/admins/:adminId
 * @desc    Owner menghapus admin dari cabang
 * @access  Private (Owner)
 */
router.delete(
  "/:id/admins/:adminId",
  authenticateToken,
  AdminController.removeBranchAdmin
);

export default router;
