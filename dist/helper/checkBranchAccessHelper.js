"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBranchAccess = checkBranchAccess;
const database_1 = require("../database");
/**
 * Helper function untuk cek akses ke branch
 * Return true jika user adalah owner atau admin/staff dari branch
 */
async function checkBranchAccess(userId, branchId) {
    // Cek apakah user adalah owner dari branch
    const branch = await database_1.prisma.branch.findUnique({
        where: { id: branchId },
    });
    if (!branch)
        return false;
    const owner = await database_1.prisma.owner.findUnique({
        where: { userId },
    });
    if (owner && branch.ownerId === owner.id) {
        return true;
    }
    // Cek apakah user adalah admin/staff dari branch
    const admin = await database_1.prisma.admin.findUnique({
        where: { userId },
    });
    if (admin && admin.branchId === branchId) {
        return true;
    }
    return false;
}
//# sourceMappingURL=checkBranchAccessHelper.js.map