import { prisma } from "../database";

const orderInclude = {
  orderItems: {
    include: {
      roomAndDevice: {
        include: {
          category: true,
        },
      },
    },
  },
  branch: {
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
    },
  },
  customer: {
    select: {
      id: true,
      email: true,
      fullname: true,
      phone: true,
    },
  },
  payment: true,
  session: true,
  review: true,
};

export const OrderRepository = {
  // Find Unique
  findUnique(where: any) {
    return prisma.order.findUnique({
      where: where,
      include: orderInclude,
    });
  },

  // Find order by ID
  findById(orderId: bigint) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });
  },

  // Find order by order code
  findByOrderCode(orderCode: string) {
    return prisma.order.findUnique({
      where: { orderCode },
      include: orderInclude,
    });
  },

  // Find first order by custom where
  findFirst(where: object, options?: object) {
    return prisma.order.findFirst({
      where,
      include: orderInclude,
      ...options,
    });
  },

  // Find multiple orders with pagination
  findMany(where: object, skip?: number, take?: number) {
    return prisma.order.findMany({
      where,
      include: orderInclude,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Find orders by customer ID
  findByCustomerId(customerId: bigint, skip?: number, take?: number) {
    return prisma.order.findMany({
      where: { customerId },
      include: orderInclude,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Find orders by branch ID (for admin/owner)
  findByBranchId(branchId: bigint, skip?: number, take?: number) {
    return prisma.order.findMany({
      where: { branchId },
      include: orderInclude,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Count orders
  count(where: object) {
    return prisma.order.count({ where });
  },

  // Create order with items
  create(data: any) {
    return prisma.order.create({
      data,
      include: orderInclude,
    });
  },

  // Update order
  update(orderId: bigint, data: any) {
    return prisma.order.update({
      where: { id: orderId },
      data,
      include: orderInclude,
    });
  },

  // Update order status
  updateStatus(orderId: bigint, status: string, paymentStatus: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: status as any, paymentStatus: paymentStatus as any },
      include: orderInclude,
    });
  },

  // Delete order
  delete(orderId: bigint) {
    return prisma.order.delete({
      where: { id: orderId },
    });
  },

  // Find first order matching criteria
  async findFirstSimple(where: object) {
    return prisma.order.findFirst({ where });
  },

  // Get cart order for customer
  getCartOrder(customerId: bigint, branchId?: bigint) {
    const where: any = {
      customerId,
      status: "cart",
    };
    if (branchId) {
      where.branchId = branchId;
    }
    return prisma.order.findFirst({
      where,
      include: orderInclude,
    });
  },
};
