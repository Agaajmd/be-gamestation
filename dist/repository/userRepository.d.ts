import { UserRole } from "@prisma/client";
import { UserWithOwnerAndAdmin } from "./type/user/userWithOwnerAndAdmin";
export declare const UserRepository: {
    findByIdUserOnly(userId: string | bigint): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: bigint;
        email: string;
        passwordHash: string | null;
        fullname: string;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(userId: string | bigint): Promise<UserWithOwnerAndAdmin | null>;
    findByEmail(email: string): Promise<UserWithOwnerAndAdmin | null>;
    findByEmailWithOwnerAndAdmin(email: string): Promise<UserWithOwnerAndAdmin | null>;
    createUser(data: {
        email: string;
        passwordHash: string;
        fullname: string;
        phone: string;
    }): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: bigint;
        email: string;
        passwordHash: string | null;
        fullname: string;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateLastLogin(userId: bigint): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: bigint;
        email: string;
        passwordHash: string | null;
        fullname: string;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updatePassword(email: string, passwordHash: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: bigint;
        email: string;
        passwordHash: string | null;
        fullname: string;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateUserRole(userId: bigint, role: UserRole): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: bigint;
        email: string;
        passwordHash: string | null;
        fullname: string;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=userRepository.d.ts.map