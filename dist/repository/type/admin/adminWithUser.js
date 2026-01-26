"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminWithUserConfig = void 0;
exports.adminWithUserConfig = {
    include: {
        user: {
            select: {
                email: true,
                fullname: true,
                phone: true,
            },
        },
    },
};
//# sourceMappingURL=adminWithUser.js.map