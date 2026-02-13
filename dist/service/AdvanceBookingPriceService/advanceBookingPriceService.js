"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAdvanceBookingPriceService = addAdvanceBookingPriceService;
exports.updateAdvanceBookingPriceService = updateAdvanceBookingPriceService;
exports.deleteAdvanceBookingPriceService = deleteAdvanceBookingPriceService;
// Repository
const branchRepository_1 = require("../../repository/branchRepository");
const advanceBookingPriceRepository_1 = require("../../repository/advanceBookingPriceRepository");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Error
const branchError_1 = require("../../errors/BranchError/branchError");
const advanceBookingPriceError_1 = require("../../errors/AdvanceBookingPriceError/advanceBookingPriceError");
// Service function to add an advance booking price
async function addAdvanceBookingPriceService(payload) {
    const { branchId, minDays: rawMinDays, maxDays: rawMaxDays, additionalFee: rawFee, } = payload;
    // Sanitize input
    const minDays = (0, inputSanitizer_1.sanitizeNumber)(rawMinDays, 0);
    const maxDays = rawMaxDays ? (0, inputSanitizer_1.sanitizeNumber)(rawMaxDays, 0) : null;
    const additionalFee = (0, inputSanitizer_1.sanitizeNumber)(rawFee, 0);
    // Validate sanitization
    if (minDays === null) {
        throw new Error("Invalid minDays provided");
    }
    if (additionalFee === null) {
        throw new Error("Invalid additionalFee provided");
    }
    if (maxDays === null && rawMaxDays !== null) {
        throw new Error("Invalid maxDays provided");
    }
    // Validate range: minDays must be <= maxDays (if maxDays is provided)
    if (maxDays !== null && minDays > maxDays) {
        throw new Error("Invalid range: minDays must be less than or equal to maxDays");
    }
    const branch = await branchRepository_1.BranchRepository.findById(branchId);
    if (!branch) {
        throw new branchError_1.BranchNotFoundError();
    }
    // Get all existing advance booking prices for this branch
    const allExisting = await advanceBookingPriceRepository_1.AdvanceBookingPriceRepository.findAll();
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
            throw new Error(`Range overlap detected: ${existingMin}-${existingMax || "unlimited"}`);
        }
    }
    // Check for multiple unlimited ranges (maxDays = null)
    const hasUnlimitedRange = branchExisting.some((abp) => abp.maxDays === null);
    if (hasUnlimitedRange && maxDays === null) {
        throw new Error("Cannot have multiple unlimited ranges (maxDays = null)");
    }
    const newAdvanceBookingPrice = await advanceBookingPriceRepository_1.AdvanceBookingPriceRepository.create({
        branchId,
        minDays,
        maxDays,
        additionalFee,
    });
    return newAdvanceBookingPrice;
}
// Service function to update an advance booking price
async function updateAdvanceBookingPriceService(payload) {
    const { id, minDays: rawMinDays, maxDays: rawMaxDays, additionalFee: rawFee, } = payload;
    // Sanitize input
    const minDays = rawMinDays
        ? ((0, inputSanitizer_1.sanitizeNumber)(rawMinDays, 0) ?? undefined)
        : undefined;
    const maxDays = rawMaxDays !== undefined
        ? rawMaxDays
            ? ((0, inputSanitizer_1.sanitizeNumber)(rawMaxDays, 0) ?? undefined)
            : null
        : undefined;
    const additionalFee = rawFee
        ? ((0, inputSanitizer_1.sanitizeNumber)(rawFee, 0) ?? undefined)
        : undefined;
    const advanceBookingPrice = await advanceBookingPriceRepository_1.AdvanceBookingPriceRepository.findById(id);
    if (!advanceBookingPrice) {
        throw new advanceBookingPriceError_1.AdvanceBookingPriceNotFoundError();
    }
    // If updating range, validate it
    if (minDays !== undefined || maxDays !== undefined) {
        const newMinDays = minDays ?? advanceBookingPrice.minDays;
        const newMaxDays = maxDays ?? advanceBookingPrice.maxDays;
        // Validate range: minDays must be <= maxDays (if maxDays is provided)
        if (newMinDays === null) {
            throw new Error("minDays cannot be null");
        }
        if (newMaxDays !== null && newMinDays > newMaxDays) {
            throw new Error("Invalid range: minDays must be less than or equal to maxDays");
        }
        // Check for overlapping ranges with other entries (excluding current)
        const allExisting = await advanceBookingPriceRepository_1.AdvanceBookingPriceRepository.findAll();
        const branchExisting = allExisting.filter((abp) => abp.branchId === advanceBookingPrice.branchId && abp.id !== id);
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
                throw new Error(`Range overlap detected: ${existingMin}-${existingMax || "unlimited"}`);
            }
        }
        // Check for multiple unlimited ranges (maxDays = null)
        const hasUnlimitedRange = branchExisting.some((abp) => abp.maxDays === null);
        if (hasUnlimitedRange && newMaxDays === null) {
            throw new Error("Cannot have multiple unlimited ranges (maxDays = null)");
        }
    }
    const updatedAdvanceBookingPrice = await advanceBookingPriceRepository_1.AdvanceBookingPriceRepository.update(id, {
        minDays,
        maxDays,
        additionalFee,
    });
    return updatedAdvanceBookingPrice;
}
// Service function to delete an advance booking price
async function deleteAdvanceBookingPriceService(id) {
    const advanceBookingPrice = await advanceBookingPriceRepository_1.AdvanceBookingPriceRepository.findById(id);
    if (!advanceBookingPrice) {
        throw new advanceBookingPriceError_1.AdvanceBookingPriceNotFoundError();
    }
    const deletedAdvanceBookingPrice = await advanceBookingPriceRepository_1.AdvanceBookingPriceRepository.delete(id);
    return deletedAdvanceBookingPrice;
}
//# sourceMappingURL=advanceBookingPriceService.js.map