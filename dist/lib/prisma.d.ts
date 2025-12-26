import { PrismaClient } from "../../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
declare const prismaClientSingleton: () => PrismaClient<{
    adapter: PrismaPg;
}, never, import("../../generated/prisma/runtime/client").DefaultArgs>;
declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}
declare const prisma: PrismaClient<{
    adapter: PrismaPg;
}, never, import("../../generated/prisma/runtime/client").DefaultArgs>;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map