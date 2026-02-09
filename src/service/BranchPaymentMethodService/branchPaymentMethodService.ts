// Repository
import { BranchPaymentMethodRepository } from "../../repository/branchPaymentMethodRepository";
import { BranchRepository } from "../../repository/branchRepository";
import { sanitizeString, sanitizeNumber } from "../../helper/inputSanitizer";

// Error
import { BranchNotFoundError } from "../../errors/BranchError/branchError";
import {
  BranchPaymentMethodNotFoundError,
  BranchPaymentMethodAlreadyExistsError,
} from "../../errors/BranchPaymentMethodError/branchPaymentMethodError";
import { PaymentMethod, PaymentProvider } from "@prisma/client";

// Service to add a new branch payment method
export async function addBranchPaymentMethodService(payload: {
  branchId: bigint;
  method: PaymentMethod;
  provider: PaymentProvider;
  isActive?: boolean;
  accountNumber?: string;
  accountName?: string;
  qrCodeImage?: string;
  instructions?: string;
}) {
  const {
    branchId,
    method,
    provider,
    isActive,
    accountNumber: rawAccountNumber,
    accountName: rawAccountName,
    qrCodeImage: rawQrCodeImage,
    instructions: rawInstructions,
  } = payload;

  // Sanitize input
  const accountNumber = rawAccountNumber
    ? sanitizeString(rawAccountNumber)
    : undefined;
  const accountName = rawAccountName
    ? sanitizeString(rawAccountName)
    : undefined;
  const qrCodeImage = rawQrCodeImage
    ? sanitizeString(rawQrCodeImage)
    : undefined;
  const instructions = rawInstructions
    ? sanitizeString(rawInstructions)
    : undefined;

  // Validate branch exists
  const branch = await BranchRepository.findById(branchId);
  if (!branch) {
    throw new BranchNotFoundError();
  }

  // Check if payment method for this provider already exists
  const existingPaymentMethod =
    await BranchPaymentMethodRepository.findByBranchIdAndProvider(
      branchId,
      provider,
    );

  if (existingPaymentMethod) {
    throw new BranchPaymentMethodAlreadyExistsError(provider);
  }

  const newPaymentMethod = await BranchPaymentMethodRepository.create({
    branchId,
    method,
    provider,
    isActive,
    accountNumber: accountNumber || undefined,
    accountName: accountName || undefined,
    qrCodeImage: qrCodeImage || undefined,
    instructions: instructions || undefined,
  });

  return newPaymentMethod;
}

// Service to get all payment methods for a branch
export async function getBranchPaymentMethodsService(branchId: bigint) {
  const branch = await BranchRepository.findById(branchId);
  if (!branch) {
    throw new BranchNotFoundError();
  }

  const paymentMethods =
    await BranchPaymentMethodRepository.findByBranchId(branchId);

  return paymentMethods;
}

// Service to get active payment methods for a branch
export async function getActiveBranchPaymentMethodsService(branchId: bigint) {
  const branch = await BranchRepository.findById(branchId);
  if (!branch) {
    throw new BranchNotFoundError();
  }

  const paymentMethods =
    await BranchPaymentMethodRepository.findActiveByBranchId(branchId);

  return paymentMethods;
}

// Service to get payment method by ID
export async function getBranchPaymentMethodByIdService(id: bigint) {
  const paymentMethod = await BranchPaymentMethodRepository.findById(id);

  if (!paymentMethod) {
    throw new BranchPaymentMethodNotFoundError();
  }

  return paymentMethod;
}

// Service to update payment method
export async function updateBranchPaymentMethodService(payload: {
  id: bigint;
  method?: PaymentMethod;
  provider?: PaymentProvider;
  isActive?: boolean;
  accountNumber?: string | null;
  accountName?: string | null;
  qrCodeImage?: string | null;
  instructions?: string | null;
  displayOrder?: number;
}) {
  const {
    id,
    method,
    provider,
    isActive,
    accountNumber: rawAccountNumber,
    accountName: rawAccountName,
    qrCodeImage: rawQrCodeImage,
    instructions: rawInstructions,
    displayOrder: rawDisplayOrder,
  } = payload;

  // Sanitize input
  const accountNumber = rawAccountNumber
    ? sanitizeString(rawAccountNumber)
    : rawAccountNumber;
  const accountName = rawAccountName
    ? sanitizeString(rawAccountName)
    : rawAccountName;
  const qrCodeImage = rawQrCodeImage
    ? sanitizeString(rawQrCodeImage)
    : rawQrCodeImage;
  const instructions = rawInstructions
    ? sanitizeString(rawInstructions)
    : rawInstructions;
  const displayOrder = rawDisplayOrder
    ? (sanitizeNumber(rawDisplayOrder, 0) ?? undefined)
    : undefined;

  const paymentMethod = await BranchPaymentMethodRepository.findById(id);

  if (!paymentMethod) {
    throw new BranchPaymentMethodNotFoundError();
  }

  // Check if trying to change provider to one that already exists
  if (provider && provider !== paymentMethod.provider) {
    const existingPaymentMethod =
      await BranchPaymentMethodRepository.findByBranchIdAndProvider(
        paymentMethod.branchId,
        provider,
      );

    if (existingPaymentMethod) {
      throw new BranchPaymentMethodAlreadyExistsError(provider);
    }
  }

  const updateData: any = {};
  if (method !== undefined) updateData.method = method;
  if (provider !== undefined) updateData.provider = provider;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (accountNumber !== undefined) updateData.accountNumber = accountNumber;
  if (accountName !== undefined) updateData.accountName = accountName;
  if (qrCodeImage !== undefined) updateData.qrCodeImage = qrCodeImage;
  if (instructions !== undefined) updateData.instructions = instructions;
  if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

  const updatedPaymentMethod = await BranchPaymentMethodRepository.update(
    id,
    updateData,
  );

  return updatedPaymentMethod;
}

// Service to delete payment method
export async function deleteBranchPaymentMethodService(id: bigint) {
  const paymentMethod = await BranchPaymentMethodRepository.findById(id);

  if (!paymentMethod) {
    throw new BranchPaymentMethodNotFoundError();
  }

  await BranchPaymentMethodRepository.delete(id);
}

// Service to toggle payment method active status
export async function toggleBranchPaymentMethodStatusService(id: bigint) {
  const paymentMethod = await BranchPaymentMethodRepository.findById(id);

  if (!paymentMethod) {
    throw new BranchPaymentMethodNotFoundError();
  }

  const updatedPaymentMethod = await BranchPaymentMethodRepository.update(id, {
    isActive: !paymentMethod.isActive,
  });

  return updatedPaymentMethod;
}
