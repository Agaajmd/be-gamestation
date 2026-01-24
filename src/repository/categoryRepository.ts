import { prisma } from "../database";

// Type
import {
  CategoryWithRoomAndDevice,
  CategoryWithRoomAndDeviceConfig,
} from "./type/category/categoyWithRoomAndDevice.ts";
import { CategoryTier } from "@prisma/client";

export const CategoryRepository = {
  // Find all categories by branch ID with room and device
  findAllByBranchIdWithRoomAndDevice(
    branchId: bigint,
  ): Promise<CategoryWithRoomAndDevice[]> {
    return prisma.category.findMany({
      where: {
        branchId: branchId,
      },
      ...CategoryWithRoomAndDeviceConfig,
    });
  },

  // Find category by ID
  findById(categoryId: bigint) {
    return prisma.category.findUnique({
      where: { id: categoryId },
    });
  },

  // Find category by ID with count
  findByIdWithCount(categoryId: bigint) {
    return prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            roomAndDevices: true,
          },
        },
      },
    });
  },

  // Find by branch, name and tier
  findByBranchNameAndTier(branchId: bigint, name: string, tier: CategoryTier) {
    return prisma.category.findUnique({
      where: {
        branchId_name_tier: {
          branchId,
          name,
          tier,
        },
      },
    });
  },

  // Find by branch ID and category ID
  findByBranchIdAndCategoryId(branchId: bigint, categoryId: bigint) {
    return prisma.category.findFirst({
      where: { branchId, id: categoryId },
    });
  },

  // Find many with filters
  findMany(filters: {
    branchId: bigint;
    deviceType?: string;
    tier?: CategoryTier;
    isActive?: boolean;
  }) {
    return prisma.category.findMany({
      where: {
        branchId: filters.branchId,
        ...(filters.deviceType && { deviceType: filters.deviceType }),
        ...(filters.tier && { tier: filters.tier }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      },
      include: {
        _count: {
          select: {
            roomAndDevices: true,
          },
        },
      },
      orderBy: [{ tier: "asc" }, { name: "asc" }],
    });
  },

  // Create category
  create(data: {
    branchId: bigint;
    name: string;
    description?: string;
    tier: CategoryTier;
    pricePerHour: number;
    amenities?: any;
  }) {
    return prisma.category.create({
      data,
    });
  },

  // Update category
  update(categoryId: bigint, data: any) {
    return prisma.category.update({
      where: { id: categoryId },
      data,
    });
  },

  // Delete category
  delete(categoryId: bigint) {
    return prisma.category.delete({
      where: { id: categoryId },
    });
  },
};
