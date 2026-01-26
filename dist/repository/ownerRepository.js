"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerRepository = void 0;
const database_1 = require("../database");
exports.OwnerRepository = {
    // Find owner by ID
    findByUserId(userId) {
        return database_1.prisma.owner.findUnique({ where: { userId } });
    },
};
//# sourceMappingURL=ownerRepository.js.map