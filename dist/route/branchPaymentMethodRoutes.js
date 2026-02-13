"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BranchPaymentMethodController_1 = require("../controller/BranchPaymentMethodController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const branchPaymentMethodValidation_1 = require("../validation/bodyValidation/branchPaymentMethodValidation");
const uploadImage_1 = require("../helper/uploadImage");
const router = (0, express_1.default)();
/**
 * @route   POST /branch-payment-methods
 * @desc    Menambahkan payment method untuk branch
 * @access  Private (Owner/Admin)
 * @body    { branchId, method, provider, accountNumber, accountName, qrCodeImage, instructions, displayOrder }
 */
router.post("/", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, uploadImage_1.uploadImage.single("qrCodeImage"), (0, validateMiddleware_1.validateBody)(branchPaymentMethodValidation_1.createBranchPaymentMethodSchema), BranchPaymentMethodController_1.addBranchPaymentMethod);
/**
 * @route   GET /branch-payment-methods/:branchId
 * @desc    Mendapatkan semua payment methods untuk branch
 * @access  Private (Owner/Admin)
 */
router.get("/:branchId", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, BranchPaymentMethodController_1.getBranchPaymentMethods);
/**
 * @route   GET /branch-payment-methods/:branchId/active
 * @desc    Mendapatkan payment methods yang aktif untuk branch (untuk customer)
 * @access  Public
 */
router.get("/:branchId/active", BranchPaymentMethodController_1.getActiveBranchPaymentMethods);
/**
 * @route   GET /branch-payment-methods/detail/:id
 * @desc    Mendapatkan detail payment method berdasarkan ID
 * @access  Private (Owner/Admin)
 */
router.get("/detail/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, BranchPaymentMethodController_1.getBranchPaymentMethodById);
/**
 * @route   PUT /branch-payment-methods/:id
 * @desc    Memperbarui payment method
 * @access  Private (Owner/Admin)
 * @body    { method, provider, isActive, accountNumber, accountName, qrCodeImage, instructions, displayOrder }
 */
router.put("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, uploadImage_1.uploadImage.single("qrCodeImage"), (0, validateMiddleware_1.validateBody)(branchPaymentMethodValidation_1.updateBranchPaymentMethodSchema), BranchPaymentMethodController_1.updateBranchPaymentMethod);
/**
 * @route   DELETE /branch-payment-methods/:id
 * @desc    Menghapus payment method
 * @access  Private (Owner/Admin)
 */
router.delete("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, BranchPaymentMethodController_1.deleteBranchPaymentMethod);
/**
 * @route   PATCH /branch-payment-methods/:id/toggle-status
 * @desc    Toggle payment method active status
 * @access  Private (Owner/Admin)
 */
router.patch("/:id/toggle-status", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, BranchPaymentMethodController_1.toggleBranchPaymentMethodStatus);
exports.default = router;
//# sourceMappingURL=branchPaymentMethodRoutes.js.map