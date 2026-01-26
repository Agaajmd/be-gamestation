"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchRepository = void 0;
const database_1 = require("../database");
// Types
const branchWithCountRoomAndDevice_1 = require("../repository/type/branch/branchWithCountRoomAndDevice");
exports.BranchRepository = {
    // Find branch by ID
    findById(branchId) {
        return database_1.prisma.branch.findUnique({ where: { id: branchId } });
    },
    // Find Branch
    findBranch() {
        return database_1.prisma.branch.findMany();
    },
    // Find all branches
    findAll() {
        return database_1.prisma.branch.findMany({
            ...branchWithCountRoomAndDevice_1.branchWithCountRoomAndDeviceConfig,
            orderBy: { name: "asc" },
        });
    },
    // Find branch by ID just open time and close time
    findOpenAndCloseTimeById(branchId) {
        return database_1.prisma.branch.findUnique({
            where: { id: branchId },
            select: {
                openTime: true,
                closeTime: true,
            },
        });
    },
    // Find all branches with available devices
    findAvailableBranches() {
        return database_1.prisma.branch.findMany({
            where: {
                roomAndDevices: {
                    some: {
                        status: "available",
                    },
                },
            },
        });
    },
    // Create new branch
    createBranch(data) {
        return database_1.prisma.branch.create({
            data,
        });
    },
    // Find branch with details (owner, devices, admins, counts)
    findBranchWithDetails(branchId) {
        return database_1.prisma.branch.findUnique({
            where: { id: branchId },
            include: {
                owner: {
                    include: {
                        user: {
                            select: {
                                fullname: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
                roomAndDevices: {
                    orderBy: { roomNumber: "asc" },
                },
                admins: {
                    include: {
                        user: {
                            select: {
                                fullname: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });
    },
    // Find branch by ID for update/delete operations
    findBranchById(branchId) {
        return database_1.prisma.branch.findUnique({
            where: { id: branchId },
        });
    },
    // Find branch with counts for delete validation
    findBranchWithCounts(branchId) {
        return database_1.prisma.branch.findUnique({
            where: { id: branchId },
            include: {
                _count: {
                    select: {
                        roomAndDevices: true,
                        orders: true,
                    },
                },
            },
        });
    },
    // Update branch
    updateBranch(branchId, data) {
        return database_1.prisma.branch.update({
            where: { id: branchId },
            data,
        });
    },
    // Delete branch
    deleteBranch(branchId) {
        return database_1.prisma.branch.delete({
            where: { id: branchId },
        });
    },
};
//# sourceMappingURL=branchRepository.js.map