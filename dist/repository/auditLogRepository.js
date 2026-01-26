"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRepository = void 0;
const database_1 = require("../database");
exports.AuditLogRepository = {
    createAuditLog(data) {
        return database_1.prisma.auditLog.create({
            data,
        });
    },
};
//# sourceMappingURL=auditLogRepository.js.map