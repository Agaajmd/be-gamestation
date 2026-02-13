"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBranchPaymentMethodStatus = exports.deleteBranchPaymentMethod = exports.updateBranchPaymentMethod = exports.getBranchPaymentMethodById = exports.getActiveBranchPaymentMethods = exports.getBranchPaymentMethods = exports.addBranchPaymentMethod = void 0;
// Service
const branchPaymentMethodService_1 = require("../service/BranchPaymentMethodService/branchPaymentMethodService");
// Error
const responseHelper_1 = require("../helper/responseHelper");
/**
 * POST /branch-payment-methods
 * Menambahkan payment method untuk branch
 */
const addBranchPaymentMethod = async (req, res) => {
    try {
        const { branchId, method, provider, isActive, accountNumber, accountName, instructions, } = req.body;
        const qrCodeImage = req.file
            ? `uploads/payment-qrcodes/${req.file.filename}`
            : undefined;
        const newPaymentMethod = await (0, branchPaymentMethodService_1.addBranchPaymentMethodService)({
            branchId: BigInt(branchId),
            method,
            provider,
            isActive,
            accountNumber,
            accountName,
            qrCodeImage,
            instructions,
        });
        res.status(201).json({
            success: true,
            data: newPaymentMethod,
            message: "Payment method berhasil ditambahkan",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.addBranchPaymentMethod = addBranchPaymentMethod;
/**
 * GET /branch-payment-methods/:branchId
 * Mendapatkan semua payment methods untuk branch
 */
const getBranchPaymentMethods = async (req, res) => {
    try {
        const { branchId } = req.params;
        const paymentMethods = await (0, branchPaymentMethodService_1.getBranchPaymentMethodsService)(BigInt(branchId));
        res.status(200).json({
            success: true,
            data: paymentMethods,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getBranchPaymentMethods = getBranchPaymentMethods;
/**
 * GET /branch-payment-methods/:branchId/active
 * Mendapatkan payment methods yang aktif untuk branch
 */
const getActiveBranchPaymentMethods = async (req, res) => {
    try {
        const { branchId } = req.params;
        const paymentMethods = await (0, branchPaymentMethodService_1.getActiveBranchPaymentMethodsService)(BigInt(branchId));
        res.status(200).json({
            success: true,
            data: paymentMethods,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getActiveBranchPaymentMethods = getActiveBranchPaymentMethods;
/**
 * GET /branch-payment-methods/detail/:id
 * Mendapatkan detail payment method berdasarkan ID
 */
const getBranchPaymentMethodById = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentMethod = await (0, branchPaymentMethodService_1.getBranchPaymentMethodByIdService)(BigInt(id));
        res.status(200).json({
            success: true,
            data: paymentMethod,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getBranchPaymentMethodById = getBranchPaymentMethodById;
/**
 * PUT /branch-payment-methods/:id
 * Memperbarui payment method
 */
const updateBranchPaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const { method, provider, isActive, accountNumber, accountName, instructions, displayOrder, } = req.body;
        const qrCodeImage = req.file
            ? `uploads/payment-qrcodes/${req.file.filename}`
            : undefined;
        const updatedPaymentMethod = await (0, branchPaymentMethodService_1.updateBranchPaymentMethodService)({
            id: BigInt(id),
            method,
            provider,
            isActive,
            accountNumber,
            accountName,
            qrCodeImage,
            instructions,
            displayOrder,
        });
        res.status(200).json({
            success: true,
            data: updatedPaymentMethod,
            message: "Payment method berhasil diperbarui",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateBranchPaymentMethod = updateBranchPaymentMethod;
/**
 * DELETE /branch-payment-methods/:id
 * Menghapus payment method
 */
const deleteBranchPaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, branchPaymentMethodService_1.deleteBranchPaymentMethodService)(BigInt(id));
        res.status(200).json({
            success: true,
            message: "Payment method berhasil dihapus",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.deleteBranchPaymentMethod = deleteBranchPaymentMethod;
/**
 * PATCH /branch-payment-methods/:id/toggle-status
 * Toggle payment method active status
 */
const toggleBranchPaymentMethodStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPaymentMethod = await (0, branchPaymentMethodService_1.toggleBranchPaymentMethodStatusService)(BigInt(id));
        res.status(200).json({
            success: true,
            data: updatedPaymentMethod,
            message: `Payment method berhasil ${updatedPaymentMethod.isActive ? "diaktifkan" : "dinonaktifkan"}`,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.toggleBranchPaymentMethodStatus = toggleBranchPaymentMethodStatus;
//# sourceMappingURL=BranchPaymentMethodController.js.map