import { prisma } from "../database";
import {
  UserWithOwnerAndAdmin,
  UserWithOwnerAndAdminConfig,
} from "../service/AuthService/type/LoginResult";

export const UserRepository = {
  // Find user by ID
  findById(userId: string | bigint): Promise<UserWithOwnerAndAdmin | null> {
    return prisma.user.findUnique({
      where: { id: BigInt(userId) },
      ...UserWithOwnerAndAdminConfig,
    });
  },

  // Find user by email
  findByEmail(email: string): Promise<UserWithOwnerAndAdmin | null> {
    return prisma.user.findUnique({
      where: { email },
      ...UserWithOwnerAndAdminConfig,
    });
  },

  // Create new user
  createUser(data: {
    email: string;
    passwordHash: string;
    fullname: string;
    phone: string;
  }) {
    return prisma.user.create({
      data: {
        ...data,
        role: "customer",
      },
    });
  },

  updateLastLogin(userId: bigint) {
    return prisma.user.update({
      where: { id: userId },
      data: { updatedAt: new Date() },
    });
  },

  updatePassword(email: string, passwordHash: string) {
    return prisma.user.update({
      where: { email },
      data: { passwordHash, updatedAt: new Date() },
    });
  },
};
