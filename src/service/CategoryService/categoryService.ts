// Repository
import { CategoryRepository } from "../../repository/categoryRepository";
import { AuditLogRepository } from "../../repository/auditLogRepository";

// Types
import { CategoryTier } from "@prisma/client";

// Helper
import { checkBranchAccess } from "../../helper/checkBranchAccessHelper";
import { updateBranchAmenities } from "../../helper/branchAmenitiesHelper";
import {
  sanitizeString,
  sanitizeNumber,
  sanitizeObject,
} from "../../helper/inputSanitizer";

// Errors
import {
  CategoryAlreadyExistsError,
  CategoryNotFoundError,
  CategoryHasDevicesError,
} from "../../errors/CategoryError/categoryError";
import { HasNoAccessError } from "../../errors/UserError/userError";

// Types
interface AddCategoryPayload {
  branchId: bigint;
  userId: bigint;
  name: string;
  description?: string;
  tier: CategoryTier;
  pricePerHour: number;
  amenities?: any;
}

interface GetCategoriesPayload {
  branchId: bigint;
  deviceType?: string;
  tier?: CategoryTier;
  isActive?: boolean;
}

interface UpdateCategoryPayload {
  branchId: bigint;
  categoryId: bigint;
  userId: bigint;
  data: any;
}

interface DeleteCategoryPayload {
  branchId: bigint;
  categoryId: bigint;
  userId: bigint;
}

// Service function to add category
export async function addCategoryService(payload: AddCategoryPayload) {
  const {
    branchId,
    userId,
    name: rawName,
    description: rawDescription,
    tier,
    pricePerHour: rawPrice,
    amenities,
  } = payload;

  // Sanitize inputs
  const name = sanitizeString(rawName);
  const description = rawDescription
    ? sanitizeString(rawDescription)
    : undefined;
  const pricePerHour = sanitizeNumber(rawPrice, 0) || 0;
  const sanitizedAmenities = amenities ? sanitizeObject(amenities) : undefined;

  // Check authorization
  const hasAccess = await checkBranchAccess(userId, branchId);
  if (!hasAccess) {
    throw new HasNoAccessError();
  }

  // Check duplicate
  const existing = await CategoryRepository.findByBranchNameAndTier(
    branchId,
    name,
    tier,
  );

  if (existing) {
    throw new CategoryAlreadyExistsError();
  }

  // Create category
  const category = await CategoryRepository.create({
    branchId,
    name,
    description,
    tier,
    pricePerHour,
    amenities: sanitizedAmenities,
  });

  // Log audit
  await AuditLogRepository.createAuditLog({
    userId,
    action: "ADD_CATEGORY",
    entity: "Category",
    entityId: category.id,
    meta: {
      branchId: branchId.toString(),
      name,
      tier,
    },
  });

  // Auto-update branch amenities
  try {
    await updateBranchAmenities(branchId);
  } catch (error) {
    console.error("Failed to update branch amenities:", error);
  }

  return category;
}

// Service function to get categories
export async function getCategoriesService(payload: GetCategoriesPayload) {
  const { branchId, deviceType, tier, isActive } = payload;

  const categories = await CategoryRepository.findMany({
    branchId,
    deviceType,
    tier,
    isActive,
  });

  return categories;
}

// Service function to update category
export async function updateCategoryService(payload: UpdateCategoryPayload) {
  const { branchId, categoryId, userId, data: rawData } = payload;

  // Sanitize data object
  const data = sanitizeObject(rawData);

  // Check authorization
  const hasAccess = await checkBranchAccess(userId, branchId);
  if (!hasAccess) {
    throw new HasNoAccessError();
  }

  // Check category exists
  const category = await CategoryRepository.findById(categoryId);

  if (!category || category.branchId !== branchId) {
    throw new CategoryNotFoundError();
  }

  // Update category
  const updated = await CategoryRepository.update(categoryId, data);

  // Log audit
  await AuditLogRepository.createAuditLog({
    userId,
    action: "UPDATE_DEVICE_CATEGORY",
    entity: "DeviceCategory",
    entityId: categoryId,
    meta: {
      branchId: branchId.toString(),
      changes: data,
    },
  });

  // Auto-update branch amenities
  try {
    await updateBranchAmenities(branchId);
  } catch (error) {
    console.error("Failed to update branch amenities:", error);
  }

  return updated;
}

// Service function to delete category
export async function deleteCategoryService(payload: DeleteCategoryPayload) {
  const { branchId, categoryId, userId } = payload;

  // Check authorization
  const hasAccess = await checkBranchAccess(userId, branchId);
  if (!hasAccess) {
    throw new HasNoAccessError();
  }

  // Check category exists
  const category = await CategoryRepository.findByIdWithCount(categoryId);

  if (!category || category.branchId !== branchId) {
    throw new CategoryNotFoundError();
  }

  // Check if devices are using this category
  if (category._count.roomAndDevices > 0) {
    throw new CategoryHasDevicesError();
  }

  // Delete category
  await CategoryRepository.delete(categoryId);

  // Log audit
  await AuditLogRepository.createAuditLog({
    userId,
    action: "DELETE_DEVICE_CATEGORY",
    entity: "DeviceCategory",
    entityId: categoryId,
    meta: {
      branchId: branchId.toString(),
      categoryName: category.name,
    },
  });

  // Auto-update branch amenities
  try {
    await updateBranchAmenities(branchId);
  } catch (error) {
    console.error("Failed to update branch amenities:", error);
  }

  return category;
}
