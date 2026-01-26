"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBranchService = createBranchService;
exports.getAllBranchesService = getAllBranchesService;
exports.getBranchByIdService = getBranchByIdService;
exports.updateBranchService = updateBranchService;
exports.deleteBranchService = deleteBranchService;
// Repository
const branchRepository_1 = require("../../repository/branchRepository");
const auditLogRepository_1 = require("../../repository/auditLogRepository");
const ownerRepository_1 = require("../../repository/ownerRepository");
const userRepository_1 = require("../../repository/userRepository");
// Queries
const adminQuery_1 = require("../../queries/adminQuery");
// Error
const authError_1 = require("../../errors/AuthError/authError");
const userError_1 = require("../../errors/UserError/userError");
// Helper
const branchAmenitiesHelper_1 = require("../../helper/branchAmenitiesHelper");
// Types
const client_1 = require("@prisma/client");
// Service function to create a new branch
async function createBranchService(payload) {
    const { userId, name, address, phone, timeZone, openTime, closeTime, facilities, } = payload;
    const owner = await ownerRepository_1.OwnerRepository.findByUserId(userId);
    if (!owner) {
        throw new userError_1.UserNotOwnerError();
    }
    let parsedOpenTime;
    let parsedCloseTime;
    if (openTime) {
        parsedOpenTime = new Date(`1970-01-01T${openTime}Z`);
    }
    if (closeTime) {
        parsedCloseTime = new Date(`1970-01-01T${closeTime}Z`);
    }
    const initialAmenities = {
        auto: {
            roomAndDevices: { types: [], versions: [], total: 0 },
            categories: { tiers: [], names: [], total: 0 },
        },
        facilities: facilities || {
            general: [],
            foodAndBeverage: [],
            parking: [],
            entertainment: [],
            accessibility: [],
        },
        lastUpdated: new Date().toISOString(),
    };
    const branch = await branchRepository_1.BranchRepository.createBranch({
        ownerId: owner.id,
        name,
        address,
        phone,
        timezone: timeZone || "Asia/Jakarta",
        openTime: parsedOpenTime,
        closeTime: parsedCloseTime,
        amenities: initialAmenities,
    });
    await auditLogRepository_1.AuditLogRepository.createAuditLog({
        userId,
        action: `Created branch ${branch.name}`,
        entity: "Branch",
        entityId: branch.id,
        meta: {
            branchName: branch.name,
            timestamp: new Date(),
        },
    });
    return branch;
}
// Service function to get all branches
async function getAllBranchesService(userId) {
    const user = await userRepository_1.UserRepository.findByIdUserOnly(userId);
    if (!user) {
        throw new authError_1.UserNotFoundError();
    }
    let branches;
    if (user.role === client_1.UserRole.admin) {
        const admin = await adminQuery_1.AdminQuery.getAdminWithBranch(userId);
        branches = admin ? [admin.branch] : [];
    }
    else {
        branches = await branchRepository_1.BranchRepository.findBranch();
    }
    return branches;
}
// Service function to get branch by ID with authorization
async function getBranchByIdService(payload) {
    const { branchId, userId } = payload;
    const user = await userRepository_1.UserRepository.findByIdUserOnly(userId);
    if (!user) {
        throw new authError_1.UserNotFoundError();
    }
    const branch = await branchRepository_1.BranchRepository.findBranchWithDetails(branchId);
    if (!branch) {
        throw new Error("Cabang tidak ditemukan");
    }
    return branch;
}
// Service function to update branch
async function updateBranchService(payload) {
    const { branchId, userId, name, address, phone, timezone, openTime, closeTime, facilities, } = payload;
    // Check if branch exists
    const branch = await branchRepository_1.BranchRepository.findBranchById(branchId);
    if (!branch) {
        throw new Error("Cabang tidak ditemukan");
    }
    // Parse time if provided
    let parsedOpenTime;
    let parsedCloseTime;
    if (openTime) {
        parsedOpenTime = new Date(`1970-01-01T${openTime}Z`);
    }
    if (closeTime) {
        parsedCloseTime = new Date(`1970-01-01T${closeTime}Z`);
    }
    // Update facilities if provided
    if (facilities !== undefined) {
        await (0, branchAmenitiesHelper_1.updateBranchFacilities)(branchId, facilities);
    }
    // Update branch
    const updatedBranch = await branchRepository_1.BranchRepository.updateBranch(branchId, {
        name: name || branch.name,
        address: address !== null ? address : undefined,
        phone: phone !== null ? phone : undefined,
        timezone: timezone || branch.timezone,
        openTime: parsedOpenTime !== null ? parsedOpenTime : undefined,
        closeTime: parsedCloseTime !== null ? parsedCloseTime : undefined,
    });
    // Log audit
    await auditLogRepository_1.AuditLogRepository.createAuditLog({
        userId,
        action: "UPDATE_BRANCH",
        entity: "Branch",
        entityId: branchId,
        meta: {
            changes: {
                branchId: branchId.toString(),
                userId: userId.toString(),
                name,
                address,
                phone,
                timezone,
                openTime,
                closeTime,
                facilities,
            },
            timestamp: new Date().toISOString(),
        },
    });
    return updatedBranch;
}
// Service function to delete branch
async function deleteBranchService(payload) {
    const { branchId, userId } = payload;
    // Check if branch exists
    const branch = await branchRepository_1.BranchRepository.findBranchWithCounts(branchId);
    if (!branch) {
        throw new Error("Cabang tidak ditemukan");
    }
    // Check if there are active orders
    if (branch._count.orders > 0) {
        throw new Error("Tidak dapat menghapus cabang yang memiliki riwayat order. Silakan hubungi super admin.");
    }
    // Delete branch
    await branchRepository_1.BranchRepository.deleteBranch(branchId);
    // Log audit
    await auditLogRepository_1.AuditLogRepository.createAuditLog({
        userId,
        action: "DELETE_BRANCH",
        entity: "Branch",
        entityId: branchId,
        meta: {
            branchName: branch.name,
            timestamp: new Date().toISOString(),
        },
    });
    return branch;
}
//# sourceMappingURL=branchService.js.map