import { prisma } from "../database";

const paymentInclude = {
  order: {
    include: {
      customer: {
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
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
      orderItems: {
        include: {
          roomAndDevice: true,
        },
      },
    },
  },
};

export const PaymentRepository = {
  // Find payment by ID
  findById(paymentId: bigint) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
      include: paymentInclude,
    });
  },

  // Find payment by order ID
  findByOrderId(orderId: bigint) {
    return prisma.payment.findUnique({
      where: { orderId },
      include: paymentInclude,
    });
  },

  // Find many payments with filters
  findMany(where: object, skip?: number, take?: number) {
    return prisma.payment.findMany({
      where,
      include: paymentInclude,
      skip,
      take,
      orderBy: { id: "desc" },
    });
  },

  // Count payments
  count(where: object) {
    return prisma.payment.count({ where });
  },

  // Find first matching criteria
  findFirst(where: object) {
    return prisma.payment.findFirst({
      where,
      include: paymentInclude,
    });
  },

  // Create payment
  create(data: any) {
    return prisma.payment.create({
      data,
      include: paymentInclude,
    });
  },

  // Update payment
  update(paymentId: bigint, data: any) {
    return prisma.payment.update({
      where: { id: paymentId },
      data,
      include: paymentInclude,
    });
  },

  // Update status
  updateStatus(paymentId: bigint, status: string) {
    return prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: status as any,
        ...(status === "paid" && { paidAt: new Date() }),
      },
      include: paymentInclude,
    });
  },

  // Delete payment
  delete(paymentId: bigint) {
    return prisma.payment.delete({
      where: { id: paymentId },
    });
  },
};
