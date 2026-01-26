"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminQuery = void 0;
const admin_1 = require("../promise/admin");
const adminRepository_1 = require("../repository/adminRepository");
exports.AdminQuery = {
    async getAdminWithBranch(userId) {
        const result = await adminRepository_1.AdminRepository.findUnique({ userId }, admin_1.adminBranchConfig);
        return result;
    },
    async getAdminById(userId) {
        return await adminRepository_1.AdminRepository.findUnique({ userId });
    },
};
//# sourceMappingURL=adminQuery.js.map