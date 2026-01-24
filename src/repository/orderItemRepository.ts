import { prisma } from "../database";

export const OrderItemRepository = {
  // Find first
  findFirst(where: object, options?: object) {
    return prisma.orderItem.findFirst({
      where: where,
      ...options,
    });
  },

  create (data: any) {
    return prisma.orderItem.create({
      data,
    });
  }
};
