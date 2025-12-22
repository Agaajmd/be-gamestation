import { Router } from "express";
import * as PackageController from "../controller/PackageController";
import { authenticateToken } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { addPackageSchema } from "../validation/packageValidation";

const router = Router();

/**
 * @route   POST /branches/:id/packages
 * @desc    Owner/staff menambahkan paket
 * @access  Private (Owner/Admin)
 */
router.post(
  "/:id/packages",
  authenticateToken,
  validate(addPackageSchema),
  PackageController.addPackage
);

export default router;