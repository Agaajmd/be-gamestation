"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BranchController = __importStar(require("../controller/BranchController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const ValidateMiddleware = __importStar(require("../middleware/validateMiddleware"));
const branchValidation_1 = require("../validation/bodyValidation/branchValidation");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   POST /branches
 * @desc    Owner membuat cabang baru
 * @access  Private (Owner only)
 */
router.post("/", authMiddleware_1.authenticateToken, ValidateMiddleware.validateBody(branchValidation_1.createBranchSchema), BranchController.createBranch);
/**
 * @route   GET /branches
 * @desc    Get list cabang (owner/admin/super_admin)
 * @access  Private
 */
router.get("/", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwnerOrAdminStaff, BranchController.getBranches);
/**
 * @route   GET /branches/:id
 * @desc    Get detail cabang
 * @access  Private
 */
router.get("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, BranchController.getBranchById);
/**
 * @route   PUT /branches/:id
 * @desc    Update cabang (owner only)
 * @access  Private (Owner)
 */
router.put("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, ValidateMiddleware.validateBody(branchValidation_1.updateBranchSchema), BranchController.updateBranch);
/**
 * @route   DELETE /branches/:id
 * @desc    Delete cabang (owner only)
 * @access  Private (Owner)
 */
router.delete("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, BranchController.deleteBranch);
exports.default = router;
//# sourceMappingURL=branchRoutes.js.map