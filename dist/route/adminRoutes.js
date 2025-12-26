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
const AdminController = __importStar(require("../controller/AdminController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware = __importStar(require("../middleware/roleMiddleware"));
const ValidateMiddleware = __importStar(require("../middleware/validateMiddleware"));
const adminValidation_1 = require("../validation/bodyValidation/adminValidation");
const router = (0, express_1.Router)();
/**
 * @route   POST /branches/:id/admins
 * @desc    Owner menambahkan admin/staff ke cabang
 * @access  Private (Owner)
 */
router.post("/:id/admins", authMiddleware_1.authenticateToken, roleMiddleware.requireOwner, ValidateMiddleware.validateBody(adminValidation_1.addAdminSchema), AdminController.addBranchAdmin);
/**
 * @route   GET /branches/:id/admins
 * @desc    Owner melihat daftar admin di cabang
 * @access  Private (Owner)
 */
router.get("/:branchId/admins", authMiddleware_1.authenticateToken, roleMiddleware.requireOwner, AdminController.getBranchAdmins);
/**
 * @route   PUT /branches/:id/admins/:adminId
 * @desc    Owner mengupdate info admin di cabang
 * @access  Private (Owner)
 */
router.put("/:id/admins/:adminId", authMiddleware_1.authenticateToken, roleMiddleware.requireOwner, ValidateMiddleware.validateBody(adminValidation_1.updateAdminSchema), AdminController.updateBranchAdmin);
/**
 * @route   DELETE /branches/:id/admins/:adminId
 * @desc    Owner menghapus admin dari cabang
 * @access  Private (Owner)
 */
router.delete("/:id/admins/:adminId", authMiddleware_1.authenticateToken, AdminController.removeBranchAdmin);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map