import { Prisma } from "@prisma/client";
export declare const adminWithUserConfig: {
    include: {
        user: {
            select: {
                email: true;
                fullname: true;
                phone: true;
            };
        };
    };
};
export type AdminWithUser = Prisma.AdminGetPayload<typeof adminWithUserConfig>;
//# sourceMappingURL=adminWithUser.d.ts.map