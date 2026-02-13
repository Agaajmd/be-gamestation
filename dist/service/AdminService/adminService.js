"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBranchAdminService = addBranchAdminService;
exports.getBranchAdminsService = getBranchAdminsService;
exports.updateBranchAdminService = updateBranchAdminService;
exports.removeBranchAdminService = removeBranchAdminService;
// Repository
const branchRepository_1 = require("../../repository/branchRepository");
const userRepository_1 = require("../../repository/userRepository");
const adminRepository_1 = require("../../repository/adminRepository");
const auditLogRepository_1 = require("../../repository/auditLogRepository");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Error
const branchError_1 = require("../../errors/BranchError/branchError");
const authError_1 = require("../../errors/AuthError/authError");
const adminError_1 = require("../../errors/AdminError/adminError");
// Type
const client_1 = require("@prisma/client");
// Service function to add a branch admin
async function addBranchAdminService(payload) {
    const { userId, email: rawEmail, role: rawRole } = payload;
    // Sanitize input
    const email = (0, inputSanitizer_1.sanitizeEmail)(rawEmail);
    if (!email) {
        throw new Error("Invalid email provided");
    }
    const role = (0, inputSanitizer_1.sanitizeString)(rawRole);
    const [branch, user] = await Promise.all([
        branchRepository_1.BranchRepository.findById(payload.branchId),
        userRepository_1.UserRepository.findByEmail(email),
    ]);
    if (!branch) {
        throw new branchError_1.BranchNotFoundError();
    }
    if (!user) {
        throw new authError_1.UserNotFoundError();
    }
    const existingAdmin = await adminRepository_1.AdminRepository.findByUserId(user.id);
    if (existingAdmin) {
        throw new adminError_1.ExistingAdminError();
    }
    if (user.role === client_1.UserRole.customer) {
        await userRepository_1.UserRepository.updateUserRole(user.id, client_1.UserRole.admin);
    }
    const admin = await adminRepository_1.AdminRepository.createAdminWithUserData({
        userId: user.id,
        branchId: payload.branchId,
        role,
    });
    await auditLogRepository_1.AuditLogRepository.createAuditLog({
        userId,
        action: "ADD_BRANCH_ADMIN",
        entity: "Admin",
        entityId: admin.id,
        meta: {
            branchId: payload.branchId.toString(),
            adminEmail: email,
            role,
            timestamp: new Date().toISOString(),
        },
    });
    return admin;
}
// Service function to get branch admins
async function getBranchAdminsService(branchId) {
    const branch = await branchRepository_1.BranchRepository.findById(branchId);
    if (!branch) {
        throw new branchError_1.BranchNotFoundError();
    }
    const admins = await adminRepository_1.AdminRepository.findByBranchId(branchId);
    return admins;
}
// Service function to update branch admin
async function updateBranchAdminService(adminId, currentBranchId, targetBranchId, role) {
    // Sanitize input
    const sanitizedRole = role
        ? (0, inputSanitizer_1.sanitizeString)(role)
        : undefined;
    const admin = await adminRepository_1.AdminRepository.findById(adminId);
    if (!admin) {
        throw new adminError_1.AdminNotFoundError();
    }
    if (targetBranchId) {
        const BranchIdIsExisting = await branchRepository_1.BranchRepository.findById(targetBranchId);
        if (!BranchIdIsExisting) {
            throw new branchError_1.BranchNotFoundError();
        }
    }
    const updatedAdmin = await adminRepository_1.AdminRepository.updateAdmin(adminId, {
        branchId: targetBranchId,
        role: sanitizedRole,
    });
    await auditLogRepository_1.AuditLogRepository.createAuditLog({
        userId: admin.userId,
        action: "UPDATE_BRANCH_ADMIN",
        entity: "Admin",
        entityId: adminId,
        meta: {
            oldBranchId: currentBranchId.toString(),
            newBranchId: targetBranchId?.toString() || admin.branchId.toString(),
            newRole: sanitizedRole || admin.role,
            adminEmail: admin.user.email,
            timestamp: new Date().toISOString(),
        },
    });
    return updatedAdmin;
}
// Service function to remove branch admin
async function removeBranchAdminService(adminId, branchId, userId) {
    const admin = await adminRepository_1.AdminRepository.findById(adminId);
    if (!admin) {
        throw new adminError_1.AdminNotFoundError();
    }
    await adminRepository_1.AdminRepository.deleteAdminBranch(adminId);
    await userRepository_1.UserRepository.updateUserRole(admin.userId, client_1.UserRole.customer);
    await auditLogRepository_1.AuditLogRepository.createAuditLog({
        userId,
        action: "REMOVE_BRANCH_ADMIN",
        entity: "Admin",
        entityId: adminId,
        meta: {
            branchId: branchId.toString(),
            adminEmail: admin.user.email,
            timestamp: new Date().toISOString(),
        },
    });
}
//# sourceMappingURL=adminService.js.map