"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWithOwnerAndAdminConfig = void 0;
exports.UserWithOwnerAndAdminConfig = {
    include: {
        owner: true,
        admin: {
            include: {
                branch: true,
            },
        },
    },
};
//# sourceMappingURL=userWithOwnerAndAdmin.js.map