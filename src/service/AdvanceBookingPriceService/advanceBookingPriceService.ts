// Repository
import { BranchRepository } from "../../repository/branchRepository";
import { AdvanceBookingPriceRepository } from "../../repository/advanceBookingPriceRepository";

// Error
import { BranchNotFoundError } from "../../errors/BranchError/branchError";
import {
  AdvanceBookingPriceAlreadyExistsError,
  AdvanceBookingPriceNotFoundError,
} from "../../errors/AdvanceBookingPriceError/advanceBookingPriceError";

// Service function to add an advance booking price
export async function addAdvanceBookingPriceService(payload: {
  branchId: bigint;
  daysInAdvance: number;
  additionalFee: number;
}) {
  const { branchId, daysInAdvance, additionalFee } = payload;

  const branch = await BranchRepository.findById(branchId);

  if (!branch) {
    throw new BranchNotFoundError();
  }

  const existing = await AdvanceBookingPriceRepository.findOne(
    branch.id,
    daysInAdvance
  );

  if (existing) {
    throw new AdvanceBookingPriceAlreadyExistsError();
  }

  const newAdvanceBookingPrice = await AdvanceBookingPriceRepository.create({
    branchId,
    daysInAdvance,
    additionalFee,
  });

  return newAdvanceBookingPrice;
}

// Service function to update an advance booking price
export async function updateAdvanceBookingPriceService(payload: {
  id: bigint;
  daysInAdvance?: number;
  additionalFee?: number;
}) {
  const { id, daysInAdvance, additionalFee } = payload;

  const advanceBookingPrice = await AdvanceBookingPriceRepository.findById(id);

  if (!advanceBookingPrice) {
    throw new AdvanceBookingPriceNotFoundError();
  }

  const updatedAdvanceBookingPrice = await AdvanceBookingPriceRepository.update(
    id,
    {
      daysInAdvance,
      additionalFee,
    }
  );

  return updatedAdvanceBookingPrice;
}

// Service function to delete an advance booking price
export async function deleteAdvanceBookingPriceService(id: bigint) {
  const advanceBookingPrice = await AdvanceBookingPriceRepository.findById(id);

  if (!advanceBookingPrice) {
    throw new AdvanceBookingPriceNotFoundError();
  }

  const deletedAdvanceBookingPrice = await AdvanceBookingPriceRepository.delete(
    id
  );

  return deletedAdvanceBookingPrice;
}
