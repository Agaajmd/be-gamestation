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

  findByVerificationKey(verificationKey: string): Promise<UserWithOwnerAndAdmin | null> {
    return prisma.user.findFirst({
      where: { verificationKey },
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
    verificationKey?: string | null;
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

  updateVerificationTokenAndKey(
    userId: bigint,
    verificationToken: string,
    verificationKey: string,
    verificationTokenExpires: Date,
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken,
        verificationTokenExpires,
        verificationKey,
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
        verificationKey: null,
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
