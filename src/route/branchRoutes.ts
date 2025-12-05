import { Router } from "express";
import * as BranchController from "../controller/BranchController";
import { authenticateToken } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import {
  createBranchSchema,
  updateBranchSchema,
  addAdminSchema,
  addDeviceSchema,
  addPackageSchema,
} from "../validation/branchValidation";

const router = Router();

/**
 * @route   POST /branches
 * @desc    Owner membuat cabang baru
 * @access  Private (Owner only)
 */
router.post(
  "/",
  authenticateToken,
  validate(createBranchSchema),
  BranchController.createBranch
);

/**
 * @route   GET /branches
 * @desc    Get list cabang (owner/admin/super_admin)
 * @access  Private
 */
router.get("/", authenticateToken, BranchController.getBranches);

/**
 * @route   GET /branches/:id
 * @desc    Get detail cabang
 * @access  Private
 */
router.get("/:id", authenticateToken, BranchController.getBranchById);

/**
 * @route   PUT /branches/:id
 * @desc    Update cabang (owner only)
 * @access  Private (Owner)
 */
router.put(
  "/:id",
  authenticateToken,
  validate(updateBranchSchema),
  BranchController.updateBranch
);

/**
 * @route   DELETE /branches/:id
 * @desc    Delete cabang (owner only)
 * @access  Private (Owner)
 */
router.delete("/:id", authenticateToken, BranchController.deleteBranch);

/**
 * @route   POST /branches/:id/admins
 * @desc    Owner menambahkan admin/staff ke cabang
 * @access  Private (Owner)
 */
router.post(
  "/:id/admins",
  authenticateToken,
  validate(addAdminSchema),
  BranchController.addBranchAdmin
);

/**
 * @route   DELETE /branches/:id/admins/:adminId
 * @desc    Owner menghapus admin dari cabang
 * @access  Private (Owner)
 */
router.delete(
  "/:id/admins/:adminId",
  authenticateToken,
  BranchController.removeBranchAdmin
);

/**
 * @route   POST /branches/:id/devices
 * @desc    Owner/staff menambahkan device
 * @access  Private (Owner/Admin)
 */
router.post(
  "/:id/devices",
  authenticateToken,
  validate(addDeviceSchema),
  BranchController.addDevice
);

/**
 * @route   POST /branches/:id/packages
 * @desc    Owner/staff menambahkan paket
 * @access  Private (Owner/Admin)
 */
router.post(
  "/:id/packages",
  authenticateToken,
  validate(addPackageSchema),
  BranchController.addPackage
);

export default router;
