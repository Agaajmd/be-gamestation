import { Request, Response } from "express";
/**
 * POST /auth/register
 * Register user baru dengan email dan password
 */
export declare const register: (req: Request, res: Response) => Promise<void>;
/**
 * POST /auth/login
 * Login dengan email dan password
 */
export declare const login: (req: Request, res: Response) => Promise<void>;
/**
 * POST /auth/login-otp
 * Login menggunakan OTP yang dikirim ke email/phone
 * Step 1: POST /auth/login-otp dengan { email } - kirim OTP
 * Step 2: POST /auth/login-otp dengan { email, otp } - verify OTP
 */
export declare const loginOTP: (req: Request, res: Response) => Promise<void>;
/**
 * POST /auth/refresh-token
 * Refresh access token menggunakan refresh token
 */
export declare const refreshToken: (req: Request, res: Response) => Promise<void>;
/**
 * POST /auth/logout
 * Logout user (invalidate token - implement token blacklist di production)
 */
export declare const logout: (req: Request, res: Response) => Promise<void>;
/**
 * POST /auth/forgot-password
 * Request reset password - kirim OTP ke email
 */
export declare const forgotPassword: (req: Request, res: Response) => Promise<void>;
/**
 * POST /auth/reset-password
 * Reset password dengan OTP dan password baru
 */
export declare const resetPassword: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=AuthController.d.ts.map