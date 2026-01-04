import { prisma } from "../database";
import { Prisma } from "@prisma/client";

export const AuditLogRepository = {
  createAuditLog(data: {
    userId: bigint;
    action: string;
    entity: string;
    entityId: bigint | null;
    meta: Prisma.InputJsonValue | Prisma.NullTypes.JsonNull;
  }) {
    return prisma.auditLog.create({
      data,
    });
  },
};
