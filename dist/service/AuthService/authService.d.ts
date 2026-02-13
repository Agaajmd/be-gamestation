import { LoginOTPResult } from "./type/LoginOTPResult";
import { LoginResult } from "./type/LoginResult";
import { RefreshAccessTokenResult } from "./type/RefreshAccessToken";
export declare function registerUser(payload: {
    email: string;
    password: string;
    fullname: string;
    phone: string;
}): Promise<{
    id: bigint;
    email: string;
    passwordHash: string | null;
    fullname: string;
    role: import("@prisma/client").$Enums.UserRole;
    phone: string | null;
    isVerified: boolean;
    verificationToken: string | null;
    verificationTokenExpires: Date | null;
    verificationSentAt: Date | null;
    createdAt: Date;
    updatedAt: Date | null;
}>;
export declare function loginUser(payload: {
    email: string;
    password: string;
}): Promise<LoginResult>;
export declare function loginUserOTP(payload: {
    email: string;
    otp?: string;
}): Promise<LoginOTPResult>;
export declare function refreshAccessToken(payload: {
    refreshToken: string;
}): Promise<RefreshAccessTokenResult>;
export declare function logoutUser(payload: {
    authHeader: string;
}): Promise<void>;
export declare function forgetPasswordUser(payload: {
    email: string;
}): Promise<void>;
export declare function resetPasswordUser(payload: {
    email: string;
    otp: string;
    newPassword: string;
}): Promise<void>;
//# sourceMappingURL=authService.d.ts.map