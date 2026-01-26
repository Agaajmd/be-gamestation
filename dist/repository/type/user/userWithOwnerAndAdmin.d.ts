import { Prisma } from "@prisma/client";
export declare const UserWithOwnerAndAdminConfig: {
    include: {
        owner: true;
        admin: {
            include: {
                branch: true;
            };
        };
    };
};
export type UserWithOwnerAndAdmin = Prisma.UserGetPayload<typeof UserWithOwnerAndAdminConfig>;
//# sourceMappingURL=userWithOwnerAndAdmin.d.ts.map