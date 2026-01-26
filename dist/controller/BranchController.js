"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranch = exports.updateBranch = exports.getBranchById = exports.getBranches = exports.createBranch = void 0;
// Services
const branchService_1 = require("../service/BranchService/branchService");
// Error
const responseHelper_1 = require("../helper/responseHelper");
/**
 * POST /branches
 * Owner membuat cabang baru
 * Required: Owner profile must exist
 */
const createBranch = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const { name, address, phone, timezone, openTime, closeTime, facilities } = req.body;
        const branch = await (0, branchService_1.createBranchService)({
            userId,
            name,
            address,
            phone,
            timeZone: timezone,
            openTime,
            closeTime,
            facilities,
        });
        res.status(201).json({
            success: true,
            message: "Cabang berhasil dibuat",
            data: branch,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.createBranch = createBranch;
/**
 * GET /branches
 * Get list cabang (owner melihat cabang miliknya, admin melihat cabang yang dia kelola)
 */
const getBranches = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const branches = await (0, branchService_1.getAllBranchesService)(userId);
        res.status(200).json({
            success: true,
            data: branches,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getBranches = getBranches;
/**
 * GET /branches/:id
 * Get detail cabang
 */
const getBranchById = async (req, res) => {
    try {
        const branchId = BigInt(req.params.id);
        const userId = BigInt(req.user.userId);
        const branch = await (0, branchService_1.getBranchByIdService)({
            branchId,
            userId,
        });
        res.status(200).json({
            success: true,
            data: branch,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getBranchById = getBranchById;
/**
 * PUT /branches/:id
 * Update cabang (hanya owner)
 */
const updateBranch = async (req, res) => {
    try {
        const branchId = BigInt(req.params.id);
        const userId = BigInt(req.user.userId);
        const { name, address, phone, timezone, openTime, closeTime, facilities } = req.body;
        const updatedBranch = await (0, branchService_1.updateBranchService)({
            branchId,
            userId,
            name,
            address,
            phone,
            timezone,
            openTime,
            closeTime,
            facilities,
        });
        res.status(200).json({
            success: true,
            message: "Cabang berhasil diupdate",
            data: updatedBranch,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateBranch = updateBranch;
/**
 * DELETE /branches/:id
 * Delete cabang (hanya owner)
 */
const deleteBranch = async (req, res) => {
    try {
        const branchId = BigInt(req.params.id);
        const userId = BigInt(req.user.userId);
        await (0, branchService_1.deleteBranchService)({
            branchId,
            userId,
        });
        res.status(200).json({
            success: true,
            message: "Cabang berhasil dihapus",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.deleteBranch = deleteBranch;
//# sourceMappingURL=BranchController.js.map