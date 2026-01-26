import { AdminRole } from "@prisma/client";
export declare function addBranchAdminService(payload: {
    branchId: bigint;
    userId: bigint;
    email: string;
    role: AdminRole;
}): Promise<{
    user: {
        email: string;
        fullname: string;
        phone: string | null;
    };
    branch: {
        name: string;
        id: bigint;
    };
} & {
    id: bigint;
    role: import("@prisma/client").$Enums.AdminRole;
    branchId: bigint;
    userId: bigint;
}>;
export declare function getBranchAdminsService(branchId: bigint): Promise<({
    user: {
        email: string;
        fullname: string;
        phone: string | null;
    };
} & {
    id: bigint;
    role: import("@prisma/client").$Enums.AdminRole;
    branchId: bigint;
    userId: bigint;
})[]>;
export declare function updateBranchAdminService(adminId: bigint, currentBranchId: bigint, targetBranchId?: bigint, role?: AdminRole): Promise<{
    user: {
        email: string;
        fullname: string;
        phone: string | null;
    };
    branch: {
        name: string;
        id: bigint;
    };
} & {
    id: bigint;
    role: import("@prisma/client").$Enums.AdminRole;
    branchId: bigint;
    userId: bigint;
}>;
export declare function removeBranchAdminService(adminId: bigint, branchId: bigint, userId: bigint): Promise<void>;
//# sourceMappingURL=adminService.d.ts.map