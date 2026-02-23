import { Request, Response } from "express";

import {
  loginUser,
  registerUser,
  loginUserOTP,
  refreshAccessToken,
  logoutUser,
  forgetPasswordUser,
  resetPasswordUser,
} from "../service/AuthService/authService";
import {
  checkVerificationStatusService,
  resendVerificationEmailService,
  verifyEmailService,
} from "../service/VerificationService/verificationService";

import { handleError } from "../helper/responseHelper";

/**
 * POST /auth/register
 * Register new user (customer role only)
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          ...result,
        },
      },
    });
  } catch (error: any) {
    handleError(error, res);
  }
};

/**
 * POST /auth/login
 * Login with email and password
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await loginUser(req.body);

    // Response with data according to user role
    const responseData: any = {
      user: {
        id: result.user.id.toString(),
        email: result.user.email,
        fullname: result.user.fullname,
        role: result.user.role,
        phone: result.user.phone,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };

    // Add additional data if user is owner
    if (result.user.owner) {
      responseData.owner = {
        id: result.user.owner.id.toString(),
        companyName: result.user.owner.companyName,
      };
    }

    // Add additional data if user is admin
    if (result.user.admin) {
      responseData.admin = {
        id: result.user.admin.id.toString(),
        branchId: result.user.admin.branchId.toString(),
        branchName: result.user.admin.branch.name,
        role: result.user.admin.role,
      };
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: responseData,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * POST /auth/login-otp
 * Login using OTP sent to email/phone
 * Step 1: POST /auth/login-otp with { email } - send OTP
 * Step 2: POST /auth/login-otp with { email, otp } - verify OTP
 */
export const loginOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await loginUserOTP(req.body);

    if (result.status === "OTP_SENT") {
      res.status(200).json({
        success: true,
        message: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          id: result.user.id.toString(),
          email: result.user.email,
          fullname: result.user.fullname,
          role: result.user.role,
          phone: result.user.phone,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token, email } = req.query;

    const result = await verifyEmailService({
      token: token as string,
      email: email as string,
    });

    res.status(200).json({
      success: true,
      message: "Email berhasil diverifikasi",
      data: {
        result,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;
    const result = await resendVerificationEmailService(email);

    res.status(200).json({
      success: true,
      message: "Email verifikasi berhasil dikirim ulang",
      data: {
        result,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const checkVerificationStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    const result = await checkVerificationStatusService(email);

    res.status(200).json({
      success: true,
      message: "Status verifikasi email berhasil diperiksa",
      data: {
        result,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * POST /auth/refresh-token
 * Refresh access token menggunakan refresh token
 */
export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await refreshAccessToken(req.body);

    res.status(200).json({
      success: true,
      message: "Token berhasil di-refresh",
      data: {
        accessToken: result.newAccessToken,
        refreshToken: result.newRefreshToken,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * POST /auth/logout
 * Logout user (invalidate token - implement token blacklist di production)
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Header Authorization wajib diisi",
      });
      return;
    }

    await logoutUser({ authHeader });

    // TODO: Implement token blacklist (gunakan Redis)
    // Tambahkan token ke blacklist sampai expired
    // await redisClient.setex(`blacklist:${token}`, JWT_EXPIRES_IN, 'true');

    res.status(200).json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * POST /auth/forgot-password
 * Request reset password - kirim OTP ke email
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await forgetPasswordUser(req.body);

    res.status(200).json({
      success: true,
      message: "Jika email terdaftar, OTP akan dikirim ke email Anda",
      data: {
        expiresIn: 600, // 10 menit dalam detik
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * POST /auth/reset-password
 * Reset password dengan OTP dan password baru
 */
export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await resetPasswordUser(req.body);

    res.status(200).json({
      success: true,
      message: "Password berhasil direset. Silakan login dengan password baru",
    });
  } catch (error) {
    handleError(error, res);
  }
};
