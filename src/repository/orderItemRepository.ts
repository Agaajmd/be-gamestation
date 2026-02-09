import { prisma } from "../database";

export const OrderItemRepository = {
  // Find first
  findFirst(where: object, options?: object) {
    return prisma.orderItem.findFirst({
      where: where,
      ...options,
    });
  },

  findMany(where: object, options?: object) {
    return prisma.orderItem.findMany({
      where: where,
      ...options,
    });
  },

  create (data: any) {
    return prisma.orderItem.create({
      data,
    });
  },

  findById (id: bigint, options?: object) {
    return prisma.orderItem.findUnique({
      where: { id },
      ...options,
    });
  },

  delete (id: bigint) {
    return prisma.orderItem.delete({
      where: { id },
    });
  }
};
