import { Prisma } from "@prisma/client";

export const adminWithUserConfig = {
  include: {
    user: {
      select: {
        email: true,
        fullname: true,
        phone: true,
      },
    },
  },
} satisfies Prisma.AdminDefaultArgs;

export type AdminWithUser = Prisma.AdminGetPayload<typeof adminWithUserConfig>;

