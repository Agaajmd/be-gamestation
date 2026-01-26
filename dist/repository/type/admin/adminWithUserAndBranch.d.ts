import { Prisma } from "@prisma/client";
export declare const adminWithUserAndBranchConfig: {
    include: {
        user: {
            select: {
                email: true;
                fullname: true;
                phone: true;
            };
        };
        branch: {
            select: {
                id: true;
                name: true;
            };
        };
    };
};
export type AdminWithUserAndBranch = Prisma.AdminGetPayload<typeof adminWithUserAndBranchConfig>;
//# sourceMappingURL=adminWithUserAndBranch.d.ts.map