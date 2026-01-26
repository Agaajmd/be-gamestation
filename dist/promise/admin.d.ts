import { Prisma } from "@prisma/client";
export declare const adminBranchConfig: {
    include: {
        branch: true;
    };
};
export type AdminWithBranch = Prisma.AdminGetPayload<typeof adminBranchConfig>;
//# sourceMappingURL=admin.d.ts.map