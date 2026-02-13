import { Request, Response } from "express";
/**
 * POST /auth/register
 * Register new user (customer role only)
 */
export declare const register: (req: Request, res: Response) => Promise<void>;
/**
 * POST /auth/login
 * Login with email and password
 */
export declare const login: (req: Request, res: Response) => Promise<void>;
/**
 * POST /auth/login-otp
 * Login using OTP sent to email/phone
 * Step 1: POST /auth/login-otp with { email } - send OTP
 * Step 2: POST /auth/login-otp with { email, otp } - verify OTP
 */
export declare const loginOTP: (req: Request, res: Response) => Promise<void>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<void>;
export declare const resendVerificationEmail: (req: Request, res: Response) => Promise<void>;
export declare const checkVerificationStatus: (req: Request, res: Response) => Promise<void>;
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