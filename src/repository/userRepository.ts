import { UserRole } from "@prisma/client";
import { prisma } from "../database";
import {
  UserWithOwnerAndAdmin,
  UserWithOwnerAndAdminConfig,
} from "./type/user/userWithOwnerAndAdmin";

export const UserRepository = {
  
  findFirst(where: object, options?: object) {
    return prisma.user.findFirst({
      where: where,
      ...options,
    });
  },

  findByIdUserOnly(userId: string | bigint) {
    return prisma.user.findUnique({
      where: {
        id: BigInt(userId),
      },
    });
  },

  findById(userId: string | bigint): Promise<UserWithOwnerAndAdmin | null> {
    return prisma.user.findUnique({
      where: { id: BigInt(userId) },
      ...UserWithOwnerAndAdminConfig,
    });
  },

  findByEmail(email: string): Promise<UserWithOwnerAndAdmin | null> {
    return prisma.user.findUnique({
      where: { email },
      ...UserWithOwnerAndAdminConfig,
    });
  },

  findByEmailWithOwnerAndAdmin(
    email: string,
  ): Promise<UserWithOwnerAndAdmin | null> {
    return prisma.user.findUnique({
      where: { email },
      ...UserWithOwnerAndAdminConfig,
    });
  },

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

  updateVerificationToken(
    userId: bigint,
    verificationToken: string,
    verificationTokenExpires: Date,
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken,
        verificationTokenExpires,
        verificationSentAt: new Date(),
      },
    });
  },

  setVerified(userId: bigint) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });
  },

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
