"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBranchPaymentMethodService = addBranchPaymentMethodService;
exports.getBranchPaymentMethodsService = getBranchPaymentMethodsService;
exports.getActiveBranchPaymentMethodsService = getActiveBranchPaymentMethodsService;
exports.getBranchPaymentMethodByIdService = getBranchPaymentMethodByIdService;
exports.updateBranchPaymentMethodService = updateBranchPaymentMethodService;
exports.deleteBranchPaymentMethodService = deleteBranchPaymentMethodService;
exports.toggleBranchPaymentMethodStatusService = toggleBranchPaymentMethodStatusService;
// Repository
const branchPaymentMethodRepository_1 = require("../../repository/branchPaymentMethodRepository");
const branchRepository_1 = require("../../repository/branchRepository");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Error
const branchError_1 = require("../../errors/BranchError/branchError");
const branchPaymentMethodError_1 = require("../../errors/BranchPaymentMethodError/branchPaymentMethodError");
// Service to add a new branch payment method
async function addBranchPaymentMethodService(payload) {
    const { branchId, method, provider, isActive, accountNumber: rawAccountNumber, accountName: rawAccountName, qrCodeImage: rawQrCodeImage, instructions: rawInstructions, } = payload;
    // Sanitize input
    const accountNumber = rawAccountNumber
        ? (0, inputSanitizer_1.sanitizeString)(rawAccountNumber)
        : undefined;
    const accountName = rawAccountName
        ? (0, inputSanitizer_1.sanitizeString)(rawAccountName)
        : undefined;
    const qrCodeImage = rawQrCodeImage
        ? (0, inputSanitizer_1.sanitizeString)(rawQrCodeImage)
        : undefined;
    const instructions = rawInstructions
        ? (0, inputSanitizer_1.sanitizeString)(rawInstructions)
        : undefined;
    // Validate branch exists
    const branch = await branchRepository_1.BranchRepository.findById(branchId);
    if (!branch) {
        throw new branchError_1.BranchNotFoundError();
    }
    // Check if payment method for this provider already exists
    const existingPaymentMethod = await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.findByBranchIdAndProvider(branchId, provider);
    if (existingPaymentMethod) {
        throw new branchPaymentMethodError_1.BranchPaymentMethodAlreadyExistsError(provider);
    }
    const newPaymentMethod = await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.create({
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
async function getBranchPaymentMethodsService(branchId) {
    const branch = await branchRepository_1.BranchRepository.findById(branchId);
    if (!branch) {
        throw new branchError_1.BranchNotFoundError();
    }
    const paymentMethods = await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.findByBranchId(branchId);
    return paymentMethods;
}
// Service to get active payment methods for a branch
async function getActiveBranchPaymentMethodsService(branchId) {
    const branch = await branchRepository_1.BranchRepository.findById(branchId);
    if (!branch) {
        throw new branchError_1.BranchNotFoundError();
    }
    const paymentMethods = await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.findActiveByBranchId(branchId);
    return paymentMethods;
}
// Service to get payment method by ID
async function getBranchPaymentMethodByIdService(id) {
    const paymentMethod = await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.findById(id);
    if (!paymentMethod) {
        throw new branchPaymentMethodError_1.BranchPaymentMethodNotFoundError();
    }
    return paymentMethod;
}
// Service to update payment method
async function updateBranchPaymentMethodService(payload) {
    const { id, method, provider, isActive, accountNumber: rawAccountNumber, accountName: rawAccountName, qrCodeImage: rawQrCodeImage, instructions: rawInstructions, displayOrder: rawDisplayOrder, } = payload;
    // Sanitize input
    const accountNumber = rawAccountNumber
        ? (0, inputSanitizer_1.sanitizeString)(rawAccountNumber)
        : rawAccountNumber;
    const accountName = rawAccountName
        ? (0, inputSanitizer_1.sanitizeString)(rawAccountName)
        : rawAccountName;
    const qrCodeImage = rawQrCodeImage
        ? (0, inputSanitizer_1.sanitizeString)(rawQrCodeImage)
        : rawQrCodeImage;
    const instructions = rawInstructions
        ? (0, inputSanitizer_1.sanitizeString)(rawInstructions)
        : rawInstructions;
    const displayOrder = rawDisplayOrder
        ? ((0, inputSanitizer_1.sanitizeNumber)(rawDisplayOrder, 0) ?? undefined)
        : undefined;
    const paymentMethod = await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.findById(id);
    if (!paymentMethod) {
        throw new branchPaymentMethodError_1.BranchPaymentMethodNotFoundError();
    }
    // Check if trying to change provider to one that already exists
    if (provider && provider !== paymentMethod.provider) {
        const existingPaymentMethod = await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.findByBranchIdAndProvider(paymentMethod.branchId, provider);
        if (existingPaymentMethod) {
            throw new branchPaymentMethodError_1.BranchPaymentMethodAlreadyExistsError(provider);
        }
    }
    const updateData = {};
    if (method !== undefined)
        updateData.method = method;
    if (provider !== undefined)
        updateData.provider = provider;
    if (isActive !== undefined)
        updateData.isActive = isActive;
    if (accountNumber !== undefined)
        updateData.accountNumber = accountNumber;
    if (accountName !== undefined)
        updateData.accountName = accountName;
    if (qrCodeImage !== undefined)
        updateData.qrCodeImage = qrCodeImage;
    if (instructions !== undefined)
        updateData.instructions = instructions;
    if (displayOrder !== undefined)
        updateData.displayOrder = displayOrder;
    const updatedPaymentMethod = await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.update(id, updateData);
    return updatedPaymentMethod;
}
// Service to delete payment method
async function deleteBranchPaymentMethodService(id) {
    const paymentMethod = await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.findById(id);
    if (!paymentMethod) {
        throw new branchPaymentMethodError_1.BranchPaymentMethodNotFoundError();
    }
    await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.delete(id);
}
// Service to toggle payment method active status
async function toggleBranchPaymentMethodStatusService(id) {
    const paymentMethod = await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.findById(id);
    if (!paymentMethod) {
        throw new branchPaymentMethodError_1.BranchPaymentMethodNotFoundError();
    }
    const updatedPaymentMethod = await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.update(id, {
        isActive: !paymentMethod.isActive,
    });
    return updatedPaymentMethod;
}
//# sourceMappingURL=branchPaymentMethodService.js.map