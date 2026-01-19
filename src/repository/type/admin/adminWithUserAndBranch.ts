import { Prisma } from "@prisma/client";

export const adminWithUserAndBranchConfig = {
  include: {
    user: {
      select: {
        email: true,
        fullname: true,
        phone: true,
      },
    },
    branch: {
      select: {
        id: true,
        name: true,
      },
    },
  },
} satisfies Prisma.AdminDefaultArgs;

export type AdminWithUserAndBranch = Prisma.AdminGetPayload<typeof adminWithUserAndBranchConfig>;

