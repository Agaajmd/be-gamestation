"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../database");
const userWithOwnerAndAdmin_1 = require("./type/user/userWithOwnerAndAdmin");
exports.UserRepository = {
    // Find First
    findFirst(where, options) {
        return database_1.prisma.user.findFirst({
            where: where,
            ...options,
        });
    },
    // Find by ID User only
    findByIdUserOnly(userId) {
        return database_1.prisma.user.findUnique({
            where: {
                id: BigInt(userId),
            },
        });
    },
    // Find user by ID
    findById(userId) {
        return database_1.prisma.user.findUnique({
            where: { id: BigInt(userId) },
            ...userWithOwnerAndAdmin_1.UserWithOwnerAndAdminConfig,
        });
    },
    // find user by email without relations
    findByEmail(email) {
        return database_1.prisma.user.findUnique({
            where: { email },
            ...userWithOwnerAndAdmin_1.UserWithOwnerAndAdminConfig,
        });
    },
    // Find user by email with owner and admin relations
    findByEmailWithOwnerAndAdmin(email) {
        return database_1.prisma.user.findUnique({
            where: { email },
            ...userWithOwnerAndAdmin_1.UserWithOwnerAndAdminConfig,
        });
    },
    // Create new user
    createUser(data) {
        return database_1.prisma.user.create({
            data: {
                ...data,
                role: "customer",
                isVerified: false,
                verificationSentAt: new Date(),
            },
        });
    },
    updateLastLogin(userId) {
        return database_1.prisma.user.update({
            where: { id: userId },
            data: { updatedAt: new Date() },
        });
    },
    updatePassword(email, passwordHash) {
        return database_1.prisma.user.update({
            where: { email },
            data: { passwordHash, updatedAt: new Date() },
        });
    },
    updateUserRole(userId, role) {
        return database_1.prisma.user.update({
            where: { id: userId },
            data: { role },
        });
    },
    updateVerification(userId, verificationToken, verificationTokenExpires) {
        return database_1.prisma.user.update({
            where: { id: userId },
            data: {
                isVerified: true,
                verificationToken: verificationToken ?? null,
                verificationTokenExpires: verificationTokenExpires ?? null,
            },
        });
    },
    // Update user information
    updateUserInfo(userId, data) {
        return database_1.prisma.user.update({
            where: { id: userId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            ...userWithOwnerAndAdmin_1.UserWithOwnerAndAdminConfig,
        });
    },
};
//# sourceMappingURL=userRepository.js.map