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
const CategoryController = __importStar(require("../controller/CategoryController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const ValidateMiddleware = __importStar(require("../middleware/validateMiddleware"));
const categoryValidation_1 = require("../validation/bodyValidation/categoryValidation");
const router = (0, express_1.Router)();
/**
 * @route   POST /branches/:branchId/category
 * @desc    Owner/admin menambahkan kategori order ke cabang
 * @access  Private (Owner/Admin)
 */
router.post("/:branchId/category", authMiddleware_1.authenticateToken, ValidateMiddleware.validateBody(categoryValidation_1.addCategorySchema), CategoryController.addCategory);
/**
 * @route GET /branches/:branchId/category
 * @desc Owner/admin mendapatkan daftar kategori order di cabang
 * @access  Public (atau bisa Private jika perlu)
 */
router.get("/:branchId/category", authMiddleware_1.authenticateToken, CategoryController.getCategories);
/**
 * @route   PUT /branches/:branchId/category/:categoryId
 * @desc    Owner/admin mengupdate kategori order di cabang
 * @access Private (Owner/Admin)
 */
router.put("/:branchId/category/:categoryId", authMiddleware_1.authenticateToken, ValidateMiddleware.validateBody(categoryValidation_1.updateCategorySchema), CategoryController.updateCategory);
/**
 * @route  DELETE /branches/:branchId/device-categories/:categoryId
 * @desc   Owner/admin menghapus kategori device
 * @access Private (Owner/Admin)
 */
router.delete("/:branchId/category/:categoryId", authMiddleware_1.authenticateToken, CategoryController.deleteDeviceCategory);
exports.default = router;
//# sourceMappingURL=categoriesRoutes.js.map