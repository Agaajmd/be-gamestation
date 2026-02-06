import Router from "express";
import {
  addBranchPaymentMethod,
  getBranchPaymentMethods,
  getActiveBranchPaymentMethods,
  getBranchPaymentMethodById,
  updateBranchPaymentMethod,
  deleteBranchPaymentMethod,
  toggleBranchPaymentMethodStatus,
} from "../controller/BranchPaymentMethodController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwner } from "../middleware/roleMiddleware";
import { validateBody } from "../middleware/validateMiddleware";
import {
  createBranchPaymentMethodSchema,
  updateBranchPaymentMethodSchema,
} from "../validation/bodyValidation/branchPaymentMethodValidation";
import { uploadImage } from "../helper/uploadImage";

const router = Router();

/**
 * @route   POST /branch-payment-methods
 * @desc    Menambahkan payment method untuk branch
 * @access  Private (Owner/Admin)
 * @body    { branchId, method, provider, accountNumber, accountName, qrCodeImage, instructions, displayOrder }
 */
router.post(
  "/",
  authenticateToken,
  requireOwner,
  uploadImage.single("qrCodeImage"),
  validateBody(createBranchPaymentMethodSchema),
  addBranchPaymentMethod,
);

/**
 * @route   GET /branch-payment-methods/:branchId
 * @desc    Mendapatkan semua payment methods untuk branch
 * @access  Private (Owner/Admin)
 */
router.get(
  "/:branchId",
  authenticateToken,
  requireOwner,
  getBranchPaymentMethods,
);

/**
 * @route   GET /branch-payment-methods/:branchId/active
 * @desc    Mendapatkan payment methods yang aktif untuk branch (untuk customer)
 * @access  Public
 */
router.get("/:branchId/active", getActiveBranchPaymentMethods);

/**
 * @route   GET /branch-payment-methods/detail/:id
 * @desc    Mendapatkan detail payment method berdasarkan ID
 * @access  Private (Owner/Admin)
 */
router.get(
  "/detail/:id",
  authenticateToken,
  requireOwner,
  getBranchPaymentMethodById,
);

/**
 * @route   PUT /branch-payment-methods/:id
 * @desc    Memperbarui payment method
 * @access  Private (Owner/Admin)
 * @body    { method, provider, isActive, accountNumber, accountName, qrCodeImage, instructions, displayOrder }
 */
router.put(
  "/:id",
  authenticateToken,
  requireOwner,
  uploadImage.single("qrCodeImage"),
  validateBody(updateBranchPaymentMethodSchema),
  updateBranchPaymentMethod,
);

/**
 * @route   DELETE /branch-payment-methods/:id
 * @desc    Menghapus payment method
 * @access  Private (Owner/Admin)
 */
router.delete(
  "/:id",
  authenticateToken,
  requireOwner,
  deleteBranchPaymentMethod,
);

/**
 * @route   PATCH /branch-payment-methods/:id/toggle-status
 * @desc    Toggle payment method active status
 * @access  Private (Owner/Admin)
 */
router.patch(
  "/:id/toggle-status",
  authenticateToken,
  requireOwner,
  toggleBranchPaymentMethodStatus,
);


export default router;
