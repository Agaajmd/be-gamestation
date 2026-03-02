import { PaymentMethod, PaymentProvider } from "@prisma/client";
import { prisma } from "../database";

export const BranchPaymentMethodRepository = {
  // Find First
  findFirst(where: object, options?: object) {
    return prisma.branchPaymentMethod.findFirst({
      where,
      ...options,
    });
  },

  // Find by ID
  findById(id: bigint) {
    return prisma.branchPaymentMethod.findUnique({
      where: { id },
      include: {
        branch: true,
      },
    });
  },

  // Find all by branch ID
  findByBranchId(branchId: bigint) {
    return prisma.branchPaymentMethod.findMany({
      where: { branchId },
      include: {
        branch: true,
      },
    });
  },

  // Find active payment methods by branch ID
  findActiveByBranchId(branchId: bigint) {
    return prisma.branchPaymentMethod.findMany({
      where: {
        branchId,
        isActive: true,
      },
    });
  },

  // Find by branch ID and provider
  findByBranchIdAndProvider(branchId: bigint, provider: PaymentProvider) {
    return prisma.branchPaymentMethod.findFirst({
      where: {
        branchId,
        provider,
      },
    });
  },

  // Find all
  findAll() {
    return prisma.branchPaymentMethod.findMany({
      include: {
        branch: true,
      },
      orderBy: { branchId: "asc" },
    });
  },

  // Create new payment method
  create(data: {
    branchId: bigint;
    method: PaymentMethod;
    provider?: PaymentProvider;
    isActive?: boolean;
    accountNumber?: string;
    accountName?: string;
    qrCodeImage?: string;
    instructions?: string;
  }) {
    return prisma.branchPaymentMethod.create({
      data: {
        branchId: data.branchId,
        method: data.method,
        provider: data.provider,
        isActive: data.isActive ?? true,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        qrCodeImage: data.qrCodeImage,
        instructions: data.instructions,
      },
      include: {
        branch: true,
      },
    });
  },

  // Update payment method
  update(
    id: bigint,
    data: {
      method?: PaymentMethod;
      provider?: PaymentProvider;
      isActive?: boolean;
      accountNumber?: string | null;
      accountName?: string | null;
      qrCodeImage?: string | null;
      instructions?: string | null;
      displayOrder?: number;
    },
  ) {
    return prisma.branchPaymentMethod.update({
      where: { id },
      data,
      include: {
        branch: true,
      },
    });
  },

  // Delete payment method
  delete(id: bigint) {
    return prisma.branchPaymentMethod.delete({
      where: { id },
    });
  },

  // Check if payment method exists
  exists(id: bigint) {
    return prisma.branchPaymentMethod.findUnique({
      where: { id },
      select: { id: true },
    });
  },
};
