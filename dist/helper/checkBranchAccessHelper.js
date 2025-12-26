"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBranchAccess = checkBranchAccess;
const prisma_1 = __importDefault(require("../lib/prisma"));
/**
 * Helper function untuk cek akses ke branch
 * Return true jika user adalah owner atau admin/staff dari branch
 */
async function checkBranchAccess(userId, branchId) {
    // Cek apakah user adalah owner dari branch
    const branch = await prisma_1.default.branch.findUnique({
        where: { id: branchId },
    });
    if (!branch)
        return false;
    const owner = await prisma_1.default.owner.findUnique({
        where: { userId },
    });
    if (owner && branch.ownerId === owner.id) {
        return true;
    }
    // Cek apakah user adalah admin/staff dari branch
    const admin = await prisma_1.default.admin.findUnique({
        where: { userId },
    });
    if (admin && admin.branchId === branchId) {
        return true;
    }
    return false;
}
//# sourceMappingURL=checkBranchAccessHelper.js.map