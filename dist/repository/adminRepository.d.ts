import { AdminRole, Prisma } from "@prisma/client";
import { AdminWithUser } from "./type/admin/adminWithUser";
import { AdminWithUserAndBranch } from "./type/admin/adminWithUserAndBranch";
export declare const AdminRepository: {
    findUnique(where: Prisma.AdminWhereUniqueInput, options?: object): Prisma.Prisma__AdminClient<{
        id: bigint;
        role: import("@prisma/client").$Enums.AdminRole;
        branchId: bigint;
        userId: bigint;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    findById(adminId: bigint): Promise<AdminWithUser | null>;
    findByUserId(userId: bigint, options?: object): Prisma.Prisma__AdminClient<{
        id: bigint;
        role: import("@prisma/client").$Enums.AdminRole;
        branchId: bigint;
        userId: bigint;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    findByBranchId(branchId: bigint): Promise<AdminWithUser[]>;
    createAdminWithUserData(data: {
        userId: bigint;
        branchId: bigint;
        role: AdminRole;
    }): Promise<AdminWithUserAndBranch>;
    updateAdmin(adminId: bigint, data: {
        branchId?: bigint;
        role?: AdminRole;
    }): Promise<AdminWithUserAndBranch>;
    deleteAdminBranch(adminId: bigint): Prisma.Prisma__AdminClient<{
        id: bigint;
        role: import("@prisma/client").$Enums.AdminRole;
        branchId: bigint;
        userId: bigint;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=adminRepository.d.ts.map