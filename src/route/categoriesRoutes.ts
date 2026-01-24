import { Router } from "express";
import * as CategoryController from "../controller/CategoryController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwnerOrAdmin } from "../middleware/roleMiddleware";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import {
    addCategorySchema,
    updateCategorySchema,
} from "../validation/bodyValidation/categoryValidation";

const router = Router();

/**
 * @route   POST /branches/:branchId/category
 * @desc    Owner/admin menambahkan kategori order ke cabang
 * @access  Private (Owner/Admin)
 */
router.post(
    "/:branchId/category",
    authenticateToken,
    requireOwnerOrAdmin,
    ValidateMiddleware.validateBody(addCategorySchema),
    CategoryController.addCategory
);

/**
 * @route GET /branches/:branchId/category
 * @desc Owner/admin mendapatkan daftar kategori order di cabang
 * @access  Public (atau bisa Private jika perlu)
 */
router.get(
    "/:branchId/category",
    authenticateToken,
    CategoryController.getCategories
);

/**
 * @route   PUT /branches/:branchId/category/:categoryId
 * @desc    Owner/admin mengupdate kategori order di cabang
 * @access Private (Owner/Admin)
 */
router.put(
    "/:branchId/category/:categoryId",
    authenticateToken,
    ValidateMiddleware.validateBody(updateCategorySchema),
    CategoryController.updateCategory
);

/**
 * @route  DELETE /branches/:branchId/device-categories/:categoryId
 * @desc   Owner/admin menghapus kategori device
 * @access Private (Owner/Admin)
 */
router.delete(
  "/:branchId/category/:categoryId",
  authenticateToken,
  CategoryController.deleteDeviceCategory
);

export default router;