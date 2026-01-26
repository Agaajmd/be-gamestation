"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBranchAdmin = exports.updateBranchAdmin = exports.getBranchAdmins = exports.addBranchAdmin = void 0;
//Service
const adminService_1 = require("../service/AdminService/adminService");
// Error
const responseHelper_1 = require("../helper/responseHelper");
/**
 * POST /branches/:id/admins
 * Owner menambahkan admin/staff ke cabang
 */
const addBranchAdmin = async (req, res) => {
    try {
        const branchId = BigInt(req.params.id);
        const userId = BigInt(req.user.userId);
        const { email, role } = req.body;
        const result = await (0, adminService_1.addBranchAdminService)({
            branchId,
            userId,
            email,
            role,
        });
        res.status(201).json({
            success: true,
            message: "Admin berhasil ditambahkan",
            data: result,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.addBranchAdmin = addBranchAdmin;
/**
 * GET /branches/:id/admins
 * Owner melihat daftar admin di cabang
 */
const getBranchAdmins = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const admins = await (0, adminService_1.getBranchAdminsService)(branchId);
        res.status(200).json({
            success: true,
            data: admins,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getBranchAdmins = getBranchAdmins;
/**
 * PUT /branches/:id/admins/:adminId
 * Owner mengupdate info admin di cabang
 */
const updateBranchAdmin = async (req, res) => {
    try {
        const currentBranchId = BigInt(req.params.id);
        const adminId = BigInt(req.params.adminId);
        const { role, newBranchId } = req.body;
        const updatedAdmin = await (0, adminService_1.updateBranchAdminService)(adminId, currentBranchId, newBranchId, role);
        res.status(200).json({
            success: true,
            message: "Admin berhasil diupdate",
            data: updatedAdmin,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateBranchAdmin = updateBranchAdmin;
/**
 * DELETE /branches/:id/admins/:adminId
 * Owner menghapus admin dari cabang
 */
const removeBranchAdmin = async (req, res) => {
    try {
        const branchId = BigInt(req.params.id);
        const adminId = BigInt(req.params.adminId);
        const userId = BigInt(req.user.userId);
        await (0, adminService_1.removeBranchAdminService)(adminId, branchId, userId);
        res.status(200).json({
            success: true,
            message: "Admin berhasil dihapus",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.removeBranchAdmin = removeBranchAdmin;
//# sourceMappingURL=AdminController.js.map