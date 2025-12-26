export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}
/**
 * Helper untuk decode JWT token dan ambil payload
 */
export declare const decodeToken: (token: string) => JWTPayload | null;
/**
 * Helper untuk ambil token dari Authorization header
 */
export declare const extractTokenFromHeader: (authHeader: string | undefined) => string | null;
/**
 * Helper untuk ambil role dari token
 */
export declare const getRoleFromToken: (token: string) => string | null;
/**
 * Helper untuk ambil userId dari token
 */
export declare const getUserIdFromToken: (token: string) => string | null;
/**
 * Helper untuk ambil email dari token
 */
export declare const getEmailFromToken: (token: string) => string | null;
//# sourceMappingURL=jwtHelper.d.ts.map