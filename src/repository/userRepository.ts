import { UserRole } from "@prisma/client";
import { prisma } from "../database";
import {
  UserWithOwnerAndAdmin,
  UserWithOwnerAndAdminConfig,
} from "./type/user/userWithOwnerAndAdmin";

export const UserRepository = {
  // Find First
  findFirst(where: object, options?: object) {
    return prisma.user.findFirst({
      where: where,
      ...options,
    });
  },

  // Find by ID User only
  findByIdUserOnly(userId: string | bigint) {
    return prisma.user.findUnique({
      where: {
        id: BigInt(userId),
      },
    });
  },

  // Find user by ID
  findById(userId: string | bigint): Promise<UserWithOwnerAndAdmin | null> {
    return prisma.user.findUnique({
      where: { id: BigInt(userId) },
      ...UserWithOwnerAndAdminConfig,
    });
  },

  // find user by email without relations
  findByEmail(email: string): Promise<UserWithOwnerAndAdmin | null> {
    return prisma.user.findUnique({
      where: { email },
      ...UserWithOwnerAndAdminConfig,
    });
  },

  // Find user by email with owner and admin relations
  findByEmailWithOwnerAndAdmin(
    email: string,
  ): Promise<UserWithOwnerAndAdmin | null> {
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
    verificationToken?: string | null;
    verificationTokenExpires?: Date | null;
  }) {
    return prisma.user.create({
      data: {
        ...data,
        role: "customer",
        isVerified: false,
        verificationSentAt: new Date(),
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

  updateUserRole(userId: bigint, role: UserRole) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  },

  updateVerification(
    userId: bigint,
    verificationToken?: string | null,
    verificationTokenExpires?: Date | null,
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        verificationToken: verificationToken ?? null,
        verificationTokenExpires: verificationTokenExpires ?? null,
      },
    });
  },

  // Update user information
  updateUserInfo(
    userId: bigint,
    data: {
      email?: string;
      fullname?: string;
      phone?: string;
    },
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      ...UserWithOwnerAndAdminConfig,
    });
  },
};
