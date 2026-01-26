"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const database_1 = require("../database");
// Type
const adminWithUser_1 = require("./type/admin/adminWithUser");
const adminWithUserAndBranch_1 = require("./type/admin/adminWithUserAndBranch");
exports.AdminRepository = {
    findUnique(where, options) {
        return database_1.prisma.admin.findUnique({
            where,
            ...options,
        });
    },
    // Find admin by ID
    findById(adminId) {
        return database_1.prisma.admin.findUnique({
            where: { id: adminId },
            ...adminWithUser_1.adminWithUserConfig,
        });
    },
    // Find admin by user ID
    findByUserId(userId, options) {
        return database_1.prisma.admin.findUnique({
            where: { userId },
            ...options,
        });
    },
    // Find admin by branch ID
    findByBranchId(branchId) {
        return database_1.prisma.admin.findMany({
            where: { branchId },
            ...adminWithUser_1.adminWithUserConfig,
        });
    },
    // Create new admin with user relation
    createAdminWithUserData(data) {
        return database_1.prisma.admin.create({
            data: {
                userId: data.userId,
                branchId: data.branchId,
                role: data.role,
            },
            ...adminWithUserAndBranch_1.adminWithUserAndBranchConfig,
        });
    },
    updateAdmin(adminId, data) {
        return database_1.prisma.admin.update({
            where: { id: adminId },
            data: {
                ...(data.role && { role: data.role }),
                ...(data.branchId && { branchId: data.branchId }),
            },
            ...adminWithUserAndBranch_1.adminWithUserAndBranchConfig,
        });
    },
    deleteAdminBranch(adminId) {
        return database_1.prisma.admin.delete({
            where: { id: adminId },
        });
    },
};
//# sourceMappingURL=adminRepository.js.map