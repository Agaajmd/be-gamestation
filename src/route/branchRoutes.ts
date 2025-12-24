import { Router } from "express";
import * as BranchController from "../controller/BranchController";
import { authenticateToken } from "../middleware/authMiddleware";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import {
  createBranchSchema,
  updateBranchSchema,
} from "../validation/bodyValidation/branchValidation";

const router = Router();

/**
 * @route   POST /branches
 * @desc    Owner membuat cabang baru
 * @access  Private (Owner only)
 */
router.post(
  "/",
  authenticateToken,
  ValidateMiddleware.validateBody(createBranchSchema),
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
  ValidateMiddleware.validateBody(updateBranchSchema),
  BranchController.updateBranch
);

/**
 * @route   DELETE /branches/:id
 * @desc    Delete cabang (owner only)
 * @access  Private (Owner)
 */
router.delete("/:id", authenticateToken, BranchController.deleteBranch);

export default router;
