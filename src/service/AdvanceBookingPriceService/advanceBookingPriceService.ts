// Repository
import { BranchRepository } from "../../repository/branchRepository";
import { AdvanceBookingPriceRepository } from "../../repository/advanceBookingPriceRepository";
import { sanitizeNumber } from "../../helper/inputSanitizer";

// Error
import { BranchNotFoundError } from "../../errors/BranchError/branchError";
import {
  AdvanceBookingPriceNotFoundError,
  InvalidMinDaysError,
  InvalidMaxDaysError,
  InvalidAdditionalFeeError,
  InvalidAdvanceBookingPriceRangeError,
  MultipleUnlimitedRangesError,
  RangeOverlapError,
} from "../../errors/AdvanceBookingPriceError/advanceBookingPriceError";

// Service function to add an advance booking price
export async function addAdvanceBookingPriceService(payload: {
  branchId: bigint;
  minDays: number;
  maxDays: number | null;
  additionalFee: number;
}) {
  const {
    branchId,
    minDays: rawMinDays,
    maxDays: rawMaxDays,
    additionalFee: rawFee,
  } = payload;

  // Sanitize input
  const minDays = sanitizeNumber(rawMinDays, 0);
  const maxDays = rawMaxDays ? sanitizeNumber(rawMaxDays, 0) : null;
  const additionalFee = sanitizeNumber(rawFee, 0);

  // Validate sanitization
  if (minDays === null) {
    throw new InvalidMinDaysError();
  }
  if (additionalFee === null) {
    throw new InvalidAdditionalFeeError();
  }
  if (maxDays === null && rawMaxDays !== null) {
    throw new InvalidMaxDaysError();
  }

  // Validate range: minDays must be <= maxDays (if maxDays is provided)
  if (maxDays !== null && minDays > maxDays) {
    throw new InvalidAdvanceBookingPriceRangeError();
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
      throw new RangeOverlapError(existingMin, existingMax);
    }
  }

  // Check for multiple unlimited ranges (maxDays = null)
  const hasUnlimitedRange = branchExisting.some((abp) => abp.maxDays === null);
  if (hasUnlimitedRange && maxDays === null) {
    throw new MultipleUnlimitedRangesError();
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
  const {
    id,
    minDays: rawMinDays,
    maxDays: rawMaxDays,
    additionalFee: rawFee,
  } = payload;

  // Sanitize input
  const minDays = rawMinDays
    ? (sanitizeNumber(rawMinDays, 0) ?? undefined)
    : undefined;
  const maxDays =
    rawMaxDays !== undefined
      ? rawMaxDays
        ? (sanitizeNumber(rawMaxDays, 0) ?? undefined)
        : null
      : undefined;
  const additionalFee = rawFee
    ? (sanitizeNumber(rawFee, 0) ?? undefined)
    : undefined;

  const advanceBookingPrice = await AdvanceBookingPriceRepository.findById(id);

  if (!advanceBookingPrice) {
    throw new AdvanceBookingPriceNotFoundError();
  }

  // If updating range, validate it
  if (minDays !== undefined || maxDays !== undefined) {
    const newMinDays = minDays ?? advanceBookingPrice.minDays;
    const newMaxDays = maxDays ?? advanceBookingPrice.maxDays;

    // Validate range: minDays must be <= maxDays (if maxDays is provided)
    if (newMinDays === null) {
      throw new InvalidMinDaysError();
    }
    if (newMaxDays !== null && newMinDays > newMaxDays) {
      throw new InvalidAdvanceBookingPriceRangeError();
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
        throw new RangeOverlapError(existingMin, existingMax);
      }
    }

    // Check for multiple unlimited ranges (maxDays = null)
    const hasUnlimitedRange = branchExisting.some(
      (abp) => abp.maxDays === null,
    );
    if (hasUnlimitedRange && newMaxDays === null) {
      throw new MultipleUnlimitedRangesError();
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
