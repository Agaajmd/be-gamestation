/**
 * Update user information - email, fullname, phone
 */
export declare const updateUserInfoService: (payload: {
    userId: bigint;
    email?: string;
    fullname?: string;
    phone?: string;
}) => Promise<{
    id: bigint;
    email: string;
    fullname: string;
    phone: string | null;
    role: import("@prisma/client").$Enums.UserRole;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date | null;
}>;
//# sourceMappingURL=userService.d.ts.map