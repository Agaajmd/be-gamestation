"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminWithUserAndBranchConfig = void 0;
exports.adminWithUserAndBranchConfig = {
    include: {
        user: {
            select: {
                email: true,
                fullname: true,
                phone: true,
            },
        },
        branch: {
            select: {
                id: true,
                name: true,
            },
        },
    },
};
//# sourceMappingURL=adminWithUserAndBranch.js.map