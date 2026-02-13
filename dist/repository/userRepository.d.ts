import { UserRole } from "@prisma/client";
import { UserWithOwnerAndAdmin } from "./type/user/userWithOwnerAndAdmin";
export declare const UserRepository: {
    findFirst(where: object, options?: object): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: bigint;
        email: string;
        passwordHash: string | null;
        fullname: string;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        verificationTokenExpires: Date | null;
        verificationSentAt: Date | null;
        createdAt: Date;
        updatedAt: Date | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByIdUserOnly(userId: string | bigint): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: bigint;
        email: string;
        passwordHash: string | null;
        fullname: string;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        verificationTokenExpires: Date | null;
        verificationSentAt: Date | null;
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
        verificationToken?: string | null;
        verificationTokenExpires?: Date | null;
    }): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: bigint;
        email: string;
        passwordHash: string | null;
        fullname: string;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        verificationTokenExpires: Date | null;
        verificationSentAt: Date | null;
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
        isVerified: boolean;
        verificationToken: string | null;
        verificationTokenExpires: Date | null;
        verificationSentAt: Date | null;
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
        isVerified: boolean;
        verificationToken: string | null;
        verificationTokenExpires: Date | null;
        verificationSentAt: Date | null;
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
        isVerified: boolean;
        verificationToken: string | null;
        verificationTokenExpires: Date | null;
        verificationSentAt: Date | null;
        createdAt: Date;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateVerification(userId: bigint, verificationToken?: string | null, verificationTokenExpires?: Date | null): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: bigint;
        email: string;
        passwordHash: string | null;
        fullname: string;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        verificationTokenExpires: Date | null;
        verificationSentAt: Date | null;
        createdAt: Date;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateUserInfo(userId: bigint, data: {
        email?: string;
        fullname?: string;
        phone?: string;
    }): import("@prisma/client").Prisma.Prisma__UserClient<{
        admin: ({
            branch: {
                name: string;
                id: bigint;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date | null;
                ownerId: bigint;
                address: string | null;
                timezone: string;
                openTime: Date | null;
                closeTime: Date | null;
                amenities: import("@prisma/client/runtime/client").JsonValue | null;
            };
        } & {
            id: bigint;
            role: import("@prisma/client").$Enums.AdminRole;
            branchId: bigint;
            userId: bigint;
        }) | null;
        owner: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date | null;
            userId: bigint;
            companyName: string;
        } | null;
    } & {
        id: bigint;
        email: string;
        passwordHash: string | null;
        fullname: string;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        verificationTokenExpires: Date | null;
        verificationSentAt: Date | null;
        createdAt: Date;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=userRepository.d.ts.map