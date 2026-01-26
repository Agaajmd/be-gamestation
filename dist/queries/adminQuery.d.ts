import { AdminWithBranch } from "../promise/admin";
export declare const AdminQuery: {
    getAdminWithBranch(userId: bigint): Promise<AdminWithBranch>;
    getAdminById(userId: bigint): Promise<{
        id: bigint;
        role: import("@prisma/client").$Enums.AdminRole;
        branchId: bigint;
        userId: bigint;
    } | null>;
};
//# sourceMappingURL=adminQuery.d.ts.map