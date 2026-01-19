import { Prisma } from "@prisma/client";

export const adminBranchConfig = {
  include: {
    branch: true,
  },
} satisfies Prisma.AdminFindFirstArgs;

export type AdminWithBranch = Prisma.AdminGetPayload<typeof adminBranchConfig>;