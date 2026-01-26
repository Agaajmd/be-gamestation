import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
declare global {
    var __prisma: PrismaClient | undefined;
    var __pool: Pool | undefined;
}
export declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
//# sourceMappingURL=index.d.ts.map