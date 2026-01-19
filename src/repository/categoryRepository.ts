import { prisma } from "../database";

// Type
import {
  CategoryWithRoomAndDevice,
  CategoryWithRoomAndDeviceConfig,
} from "./type/category/categoyWithRoomAndDevice.ts";

export const CategoryRepository = {
  // Find all categories by branch ID with room and device 
  findAllByBranchIdWithRoomAndDevice(
    branchId: bigint
  ): Promise<CategoryWithRoomAndDevice[]> {
    return prisma.category.findMany({
      where: {
        branchId: branchId,
      },
      ...CategoryWithRoomAndDeviceConfig,
    });
  },
};
