import { prisma } from "../database";

export const AdvanceBookingPriceRepository = {
  // Find advance booking price by branch ID and days in advance
  findOne(branchId: bigint, daysInAdvance: number) {
    return prisma.advanceBookingPrice.findFirst({
      where: {
        branchId,
        daysInAdvance,
      },
    });
  },

  // Find all advance booking prices
  findAll() {
    return prisma.advanceBookingPrice.findMany();
  },

  // Find advance booking price by ID
  findById(id: bigint) {
    return prisma.advanceBookingPrice.findUnique({
      where: { id },
    });
  },

  // Create a new advance booking price
  create(data: {
    branchId: bigint;
    daysInAdvance: number;
    additionalFee: number;
  }) {
    return prisma.advanceBookingPrice.create({
      data: {
        branchId: data.branchId,
        daysInAdvance: data.daysInAdvance,
        additionalFee: data.additionalFee,
      },
    });
  },

  // Update an advance booking price
  update(
    id: bigint,
    data: {
      daysInAdvance?: number;
      additionalFee?: number;
    }
  ) {
    return prisma.advanceBookingPrice.update({
      where: { id },
      data,
    });
  },

  // Delete an advance booking price
  delete(id: bigint) {
    return prisma.advanceBookingPrice.delete({
      where: { id },
    });
  },
};
