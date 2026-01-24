// Repository
import { BranchRepository } from "../../repository/branchRepository";
import { AdvanceBookingPriceRepository } from "../../repository/advanceBookingPriceRepository";

// Error
import { BranchNotFoundError } from "../../errors/BranchError/branchError";
import { AdvanceBookingPriceNotFoundError } from "../../errors/AdvanceBookingPriceError/advanceBookingPriceError";

// Service function to add an advance booking price
export async function addAdvanceBookingPriceService(payload: {
  branchId: bigint;
  minDays: number;
  maxDays: number | null;
  additionalFee: number;
}) {
  const { branchId, minDays, maxDays, additionalFee } = payload;

  // Validate range: minDays must be <= maxDays (if maxDays is provided)
  if (maxDays !== null && minDays > maxDays) {
    throw new Error(
      "Invalid range: minDays must be less than or equal to maxDays",
    );
  }

  const branch = await BranchRepository.findById(branchId);

  if (!branch) {
    throw new BranchNotFoundError();
  }

  // Get all existing advance booking prices for this branch
  const allExisting = await AdvanceBookingPriceRepository.findAll();
  const branchExisting = allExisting.filter((abp) => abp.branchId === branchId);

  // Check for overlapping ranges
  for (const existing of branchExisting) {
    const existingMin = existing.minDays;
    const existingMax = existing.maxDays;

    // Check if ranges overlap
    const isOverlap =
      // New range starts before existing ends
      (maxDays === null || existingMin <= maxDays) &&
      // New range ends after existing starts
      (existingMax === null || minDays <= existingMax);

    if (isOverlap) {
      throw new Error(
        `Range overlap detected: ${existingMin}-${existingMax || "unlimited"}`,
      );
    }
  }

  // Check for multiple unlimited ranges (maxDays = null)
  const hasUnlimitedRange = branchExisting.some((abp) => abp.maxDays === null);
  if (hasUnlimitedRange && maxDays === null) {
    throw new Error("Cannot have multiple unlimited ranges (maxDays = null)");
  }

  const newAdvanceBookingPrice = await AdvanceBookingPriceRepository.create({
    branchId,
    minDays,
    maxDays,
    additionalFee,
  });

  return newAdvanceBookingPrice;
}

// Service function to update an advance booking price
export async function updateAdvanceBookingPriceService(payload: {
  id: bigint;
  minDays?: number;
  maxDays?: number | null;
  additionalFee?: number;
}) {
  const { id, minDays, maxDays, additionalFee } = payload;

  const advanceBookingPrice = await AdvanceBookingPriceRepository.findById(id);

  if (!advanceBookingPrice) {
    throw new AdvanceBookingPriceNotFoundError();
  }

  // If updating range, validate it
  if (minDays !== undefined || maxDays !== undefined) {
    const newMinDays = minDays ?? advanceBookingPrice.minDays;
    const newMaxDays = maxDays ?? advanceBookingPrice.maxDays;

    // Validate range: minDays must be <= maxDays (if maxDays is provided)
    if (newMaxDays !== null && newMinDays > newMaxDays) {
      throw new Error(
        "Invalid range: minDays must be less than or equal to maxDays",
      );
    }

    // Check for overlapping ranges with other entries (excluding current)
    const allExisting = await AdvanceBookingPriceRepository.findAll();
    const branchExisting = allExisting.filter(
      (abp) => abp.branchId === advanceBookingPrice.branchId && abp.id !== id,
    );

    for (const existing of branchExisting) {
      const existingMin = existing.minDays;
      const existingMax = existing.maxDays;

      // Check if ranges overlap
      const isOverlap =
        // New range starts before existing ends
        (newMaxDays === null || existingMin <= newMaxDays) &&
        // New range ends after existing starts
        (existingMax === null || newMinDays <= existingMax);

      if (isOverlap) {
        throw new Error(
          `Range overlap detected: ${existingMin}-${existingMax || "unlimited"}`,
        );
      }
    }

    // Check for multiple unlimited ranges (maxDays = null)
    const hasUnlimitedRange = branchExisting.some(
      (abp) => abp.maxDays === null,
    );
    if (hasUnlimitedRange && newMaxDays === null) {
      throw new Error("Cannot have multiple unlimited ranges (maxDays = null)");
    }
  }

  const updatedAdvanceBookingPrice = await AdvanceBookingPriceRepository.update(
    id,
    {
      minDays,
      maxDays,
      additionalFee,
    },
  );

  return updatedAdvanceBookingPrice;
}

// Service function to delete an advance booking price
export async function deleteAdvanceBookingPriceService(id: bigint) {
  const advanceBookingPrice = await AdvanceBookingPriceRepository.findById(id);

  if (!advanceBookingPrice) {
    throw new AdvanceBookingPriceNotFoundError();
  }

  const deletedAdvanceBookingPrice =
    await AdvanceBookingPriceRepository.delete(id);

  return deletedAdvanceBookingPrice;
}
