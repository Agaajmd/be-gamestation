import { prisma } from "../database";

export const AdvanceBookingPriceRepository = {
  // Find First
  findFirst(where: object, options?: object) {
    return prisma.advanceBookingPrice.findFirst({
      where,
      ...options,
    });
  },

  // Find advance booking price by branch ID and days in advance
  findOne(branchId: bigint, minDays: number, maxDays: number | null) {
    const where: any = {
      branchId,
      minDays,
    };

    if (maxDays !== null) {
      where.maxDays = maxDays;
    } else {
      where.maxDays = null;
    }

    return prisma.advanceBookingPrice.findFirst({
      where,
    });
  },

  // Find all advance booking prices by branch ID
  findByBranchId(branchId: bigint) {
    return prisma.advanceBookingPrice.findMany({
      where: { branchId },
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
    minDays: number;
    maxDays: number | null;
    additionalFee: number;
  }) {
    const createData: any = {
      branchId: data.branchId,
      minDays: data.minDays,
      additionalFee: data.additionalFee,
    };

    if (data.maxDays !== null) {
      createData.maxDays = data.maxDays;
    }

    return prisma.advanceBookingPrice.create({
      data: createData,
    });
  },

  // Update an advance booking price
  update(
    id: bigint,
    data: {
      minDays?: number;
      maxDays?: number | null;
      additionalFee?: number;
    },
  ) {
    const updateData: any = {};
    
    if (data.minDays !== undefined) updateData.minDays = data.minDays;
    if (data.additionalFee !== undefined) updateData.additionalFee = data.additionalFee;
    if (data.maxDays !== undefined) updateData.maxDays = data.maxDays;

    return prisma.advanceBookingPrice.update({
      where: { id },
      data: updateData,
    });
  },

  // Delete an advance booking price
  delete(id: bigint) {
    return prisma.advanceBookingPrice.delete({
      where: { id },
    });
  },
};
