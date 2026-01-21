import { Request, Response } from "express";

// Services
import {
  addCategoryService,
  getCategoriesService,
  updateCategoryService,
  deleteCategoryService,
} from "../service/CategoryService/categoryService";

// Error
import { handleError } from "../helper/responseHelper";

// Types
import { CategoryTier } from "@prisma/client";

/**
 * POST /branches/:id/category
 * Owner/admin menambahkan kategori order ke cabang
 */
export const addCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const userId = BigInt(req.user!.userId);
    const { name, description, tier, pricePerHour, amenities } = req.body;

    const category = await addCategoryService({
      branchId,
      userId,
      name,
      description,
      tier,
      pricePerHour,
      amenities,
    });

    res.status(201).json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data: category,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /branches/:id/category
 * Mendapatkan semua kategori di cabang
 */
export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { deviceType, tier, isActive } = req.query;

    const categories = await getCategoriesService({
      branchId,
      deviceType: deviceType as string | undefined,
      tier: tier as CategoryTier | undefined,
      isActive: isActive ? isActive === "true" : undefined,
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PUT /branches/:branchId/device-categories/:categoryId
 * Owner/admin mengupdate kategori device
 */
export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const categoryId = BigInt(req.params.categoryId);
    const userId = BigInt(req.user!.userId);

    const updated = await updateCategoryService({
      branchId,
      categoryId,
      userId,
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Kategori device berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * DELETE /branches/:branchId/device-categories/:categoryId
 * Owner/admin menghapus kategori device
 */
export const deleteDeviceCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const categoryId = BigInt(req.params.categoryId);
    const userId = BigInt(req.user!.userId);

    await deleteCategoryService({
      branchId,
      categoryId,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Kategori device berhasil dihapus",
    });
  } catch (error) {
    handleError(error, res);
  }
};
