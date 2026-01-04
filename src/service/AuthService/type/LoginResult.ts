import { Prisma } from "@prisma/client";

export const UserWithOwnerAndAdminConfig = {
  include: {
    owner: true,
    admin: {
      include: {
        branch: true,
      },
    },
  },
} satisfies Prisma.UserDefaultArgs;

export type UserWithOwnerAndAdmin = Prisma.UserGetPayload<
  typeof UserWithOwnerAndAdminConfig
>;

export type LoginResult = {
  status: "SUCCESS";
  user: UserWithOwnerAndAdmin;
  accessToken: string;
  refreshToken: string;
};
