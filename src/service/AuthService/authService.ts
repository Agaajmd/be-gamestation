import { UserRepository } from "../../repository/userRepository";
import { AuditLogRepository } from "../../repository/auditLogRepository";
import { hashPassword, comparePassword } from "../../helper/password";
import {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
} from "../../helper/jwtHelper";
import { generateAndStoreOTP, verifyOTP } from "../../helper/generateOTP";
import { sendOTPEmail } from "../../helper/emailHelper";

//type
import { LoginOTPResult } from "./type/LoginOTPResult";
import { LoginResult } from "./type/LoginResult";
import { RefreshAccessTokenResult } from "./type/RefreshAccessToken";

// Error
import {
  OTPInvalidError,
  EmailNotFoundError,
  EmailExistingError,
  PasswordError,
  UserNotFoundError,
} from "../../errors/AuthError/authError";

// Service function to handle user registration
export async function registerUser(payload: {
  email: string;
  password: string;
  fullname: string;
  phone: string;
}) {
  const { email, password, fullname, phone } = payload;

  const existing = await UserRepository.findByEmail(email);

  if (existing) {
    throw new EmailExistingError();
  }

  const passwordHash = await hashPassword(password);

  const newUser = await UserRepository.createUser({
    email,
    passwordHash,
    fullname,
    phone,
  });

  const accessToken = generateToken.accessToken(
    newUser.id,
    newUser.email,
    "customer"
  );
  const refreshToken = generateToken.refreshToken(
    newUser.id,
    newUser.email,
    "customer"
  );

  return { newUser, accessToken, refreshToken };
}

// Service function to handle user login
export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  const { email, password } = payload;

  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new EmailNotFoundError();
  }

  if (!user.passwordHash) {
    throw new PasswordError();
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new PasswordError();
  }

  const accessToken = generateToken.accessToken(user.id, user.email, user.role);
  const refreshToken = generateToken.refreshToken(
    user.id,
    user.email,
    user.role
  );

  await UserRepository.updateLastLogin(user.id);

  return { status: "SUCCESS", user, accessToken, refreshToken };
}

// Service function to handle OTP login (stub implementation)
export async function loginUserOTP(payload: {
  email: string;
  otp?: string;
}): Promise<LoginOTPResult> {
  const { email, otp } = payload;

  // Check if OTP is provided
  if (!otp) {
    const newOtp = await generateAndStoreOTP(email);

    const emailSent = await sendOTPEmail({
      to: email,
      otp: newOtp,
      expiresInMinutes: 5,
    });

    if (!emailSent) {
      // Fallback: still log to console if email fails
      console.log(
        `[OTP] Email: ${email}, OTP: ${newOtp} (expires at 5 minutes from now)`
      );
      console.log("[WARNING] Email delivery failed, check console for OTP");
    }

    return { status: "OTP_SENT", message: "OTP telah dikirim ke email" };
  }

  // Verify OTP
  const isOtpValid = await verifyOTP(email, otp);

  if (!isOtpValid) {
    throw new OTPInvalidError();
  }

  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new EmailNotFoundError();
  }

  const accessToken = generateToken.accessToken(user.id, user.email, user.role);
  const refreshToken = generateToken.refreshToken(
    user.id,
    user.email,
    user.role
  );

  await UserRepository.updateLastLogin(user.id);

  return { status: "SUCCESS", user, accessToken, refreshToken };
}

// Service function to handle token refresh
export async function refreshAccessToken(payload: {
  refreshToken: string;
}): Promise<RefreshAccessTokenResult> {
  const { refreshToken: token } = payload;

  const decoded = verifyToken.refreshToken(token);

  const user = await UserRepository.findById(decoded.userId);

  if (!user) {
    throw new UserNotFoundError();
  }

  const newAccessToken = generateToken.accessToken(
    user.id,
    user.email,
    user.role
  );
  const newRefreshToken = generateToken.refreshToken(
    user.id,
    user.email,
    user.role
  );

  await UserRepository.updateLastLogin(user.id);

  return {
    status: "SUCCESS",
    newAccessToken,
    newRefreshToken,
  };
}

// Service function to handle user logout (stub implementation)
export async function logoutUser(payload: { authHeader: string }) {
  const { authHeader } = payload;
  const token = extractTokenFromHeader(authHeader);
  if (!token) {
    throw new Error("Token tidak ditemukan di header Authorization");
  }

  const decoded = verifyToken.accessToken(token);

  await AuditLogRepository.createAuditLog({
    userId: BigInt(decoded.userId),
    action: "LOGOUT",
    entity: "Auth",
    entityId: BigInt(decoded.userId),
    meta: {
      details: "User logged out",
      timestamp: new Date(),
    },
  });
}

// Service function to handle forgot password (stub implementation)
export async function forgetPasswordUser(payload: { email: string }) {
  const { email } = payload;
  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new UserNotFoundError();
  }

  const otp = await generateAndStoreOTP(email);

  await sendOTPEmail({
    to: email,
    otp,
    expiresInMinutes: 10,
  });

  await AuditLogRepository.createAuditLog({
    userId: user.id,
    action: "PASSWORD_RESET_REQUEST",
    entity: "Auth",
    entityId: user.id,
    meta: {
      details: "Password reset requested",
      timestamp: new Date(),
    },
  });
}

// Service function to handle reset password (stub implementation)
export async function resetPasswordUser(payload: {
  email: string;
  otp: string;
  newPassword: string;
}) {
  const { email, otp, newPassword } = payload;

  const isOtpValid = await verifyOTP(email, otp);

  if (!isOtpValid) {
    throw new OTPInvalidError();
  }

  const passwordHash = await hashPassword(newPassword);

  await UserRepository.updatePassword(email, passwordHash);

  const user = await UserRepository.findByEmail(email);

  if (user) {
    await AuditLogRepository.createAuditLog({
      userId: user.id,
      action: "PASSWORD_RESET",
      entity: "Auth",
      entityId: user.id,
      meta: {
        details: "Password has been reset",
        timestamp: new Date(),
      },
    });
  }
}
