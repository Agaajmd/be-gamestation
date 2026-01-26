import { Prisma } from "@prisma/client";
export declare const AuditLogRepository: {
    createAuditLog(data: {
        userId: bigint;
        action: string;
        entity: string;
        entityId: bigint | null;
        meta: Prisma.InputJsonValue | Prisma.NullTypes.JsonNull;
    }): Prisma.Prisma__AuditLogClient<{
        meta: Prisma.JsonValue | null;
        id: bigint;
        createdAt: Date;
        userId: bigint | null;
        action: string;
        entity: string;
        entityId: bigint | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=auditLogRepository.d.ts.map