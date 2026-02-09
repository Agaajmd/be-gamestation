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
import {
  generateVerificationToken,
  hashToken,
  sendVerificationEmail,
} from "../../helper/sendVerificationEmail";
import { sanitizeEmail, sanitizeString } from "../../helper/inputSanitizer";
import { validatePasswordPolicy } from "../../helper/password";

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
  EmailNotVerifiedError,
  InvalidEmailFormatError,
} from "../../errors/AuthError/authError";

// Service function to handle user registration
export async function registerUser(payload: {
  email: string;
  password: string;
  fullname: string;
  phone: string;
}) {
  const { email, password, fullname, phone } = payload;

  // Sanitize inputs
  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedFullname = sanitizeString(fullname);
  const sanitizedPhone = sanitizeString(phone);

  if (!sanitizedEmail) {
    throw new InvalidEmailFormatError();
  }

  if (!sanitizedFullname || !sanitizedPhone) {
    throw new Error("Name and phone must be valid");
  }

  const existing = await UserRepository.findByEmail(sanitizedEmail);

  if (existing) {
    throw new EmailExistingError();
  }

  const passwordValidation = validatePasswordPolicy(password);
  if (!passwordValidation.isValid) {
    throw new PasswordError(passwordValidation.errors);
  }

  const passwordHash = await hashPassword(password);

  const plainToken = generateVerificationToken();
  const hashedToken = hashToken(plainToken);
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const newUser = await UserRepository.createUser({
    email: sanitizedEmail,
    passwordHash,
    fullname: sanitizedFullname,
    phone: sanitizedPhone,
    verificationToken: hashedToken,
    verificationTokenExpires: tokenExpires,
  });

  sendVerificationEmail({
    to: sanitizedEmail,
    token: plainToken, // Plain token, bukan yang di-hash
    username: sanitizedFullname,
  }).catch((error) => {
    console.error(
      `⚠️ Failed to send verification email to ${sanitizedEmail}:`,
      error,
    );
  });

  return newUser;
}

// Service function to handle user login
export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  const { email, password } = payload;

  // Sanitize email before database query
  const sanitizedEmail = sanitizeEmail(email);

  if (!sanitizedEmail) {
    throw new InvalidEmailFormatError();
  }

  const user =
    await UserRepository.findByEmailWithOwnerAndAdmin(sanitizedEmail);

  if (!user) {
    throw new EmailNotFoundError();
  }

  if (!user.passwordHash) {
    throw new PasswordError();
  }

  if (!user.isVerified) {
    throw new EmailNotVerifiedError();
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new PasswordError();
  }

  const accessToken = generateToken.accessToken(
    user.id,
    user.email,
    user.role,
    user.admin?.role,
  );
  const refreshToken = generateToken.refreshToken(
    user.id,
    user.email,
    user.role,
    user.admin?.role,
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

  // Sanitize email
  const sanitizedEmail = sanitizeEmail(email);
  if (!sanitizedEmail) {
    throw new InvalidEmailFormatError();
  }

  // Sanitize OTP if provided (alphanumeric only)
  const sanitizedOtp = otp ? sanitizeString(otp) : undefined;

  // Check if OTP is provided
  if (!sanitizedOtp) {
    const newOtp = await generateAndStoreOTP(sanitizedEmail);

    const emailSent = await sendOTPEmail({
      to: sanitizedEmail,
      otp: newOtp,
      expiresInMinutes: 5,
    });

    if (!emailSent) {
      // Fallback: still log to console if email fails
      console.log(
        `[OTP] Email: ${email}, OTP: ${newOtp} (expires at 5 minutes from now)`,
      );
      console.log("[WARNING] Email delivery failed, check console for OTP");
    }

    return { status: "OTP_SENT", message: "OTP telah dikirim ke email" };
  }

  // Verify OTP with sanitized values
  const isOtpValid = await verifyOTP(sanitizedEmail, sanitizedOtp);

  if (!isOtpValid) {
    throw new OTPInvalidError();
  }

  const user = await UserRepository.findByEmail(sanitizedEmail);

  if (!user) {
    throw new EmailNotFoundError();
  }

  const accessToken = generateToken.accessToken(
    user.id,
    user.email,
    user.role,
    user.admin?.role,
  );
  const refreshToken = generateToken.refreshToken(
    user.id,
    user.email,
    user.role,
    user.admin?.role,
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
    user.role,
    user.admin?.role,
  );
  const newRefreshToken = generateToken.refreshToken(
    user.id,
    user.email,
    user.role,
    user.admin?.role,
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

  // Sanitize email
  const sanitizedEmail = sanitizeEmail(email);
  if (!sanitizedEmail) {
    throw new InvalidEmailFormatError();
  }

  const user = await UserRepository.findByEmail(sanitizedEmail);

  if (!user) {
    throw new UserNotFoundError();
  }

  const otp = await generateAndStoreOTP(sanitizedEmail);

  await sendOTPEmail({
    to: sanitizedEmail,
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

  // Sanitize inputs
  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedOtp = sanitizeString(otp);

  if (!sanitizedEmail) {
    throw new InvalidEmailFormatError();
  }

  // Validate new password strength
  const passwordValidation = validatePasswordPolicy(newPassword);
  if (!passwordValidation.isValid) {
    throw new PasswordError(passwordValidation.errors);
  }

  const isOtpValid = await verifyOTP(sanitizedEmail, sanitizedOtp);

  if (!isOtpValid) {
    throw new OTPInvalidError();
  }

  const passwordHash = await hashPassword(newPassword);

  await UserRepository.updatePassword(sanitizedEmail, passwordHash);

  const user = await UserRepository.findByEmail(sanitizedEmail);

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
