import { UserRole } from "@prisma/client";
export interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
    adminRole?: string;
}
export type JWTPayload = TokenPayload;
export declare const generateToken: {
    accessToken(userId: bigint, email: string, role: UserRole, adminRole?: string): string;
    refreshToken(userId: bigint, email: string, role: UserRole, adminRole?: string): string;
};
export declare const verifyToken: {
    accessToken(token: string): TokenPayload;
    refreshToken(token: string): TokenPayload;
};
export declare function extractTokenFromHeader(authHeader: string | undefined): string | null;
export declare function decodeToken(token: string): TokenPayload | null;
//# sourceMappingURL=jwtHelper.d.ts.map