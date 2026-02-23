// Repository
import { UserRepository } from "../../repository/userRepository";
import { sanitizeString, sanitizeEmail } from "../../helper/inputSanitizer";

// Helper
import {
  generateVerificationToken,
  hashToken,
  sendVerificationEmail,
} from "../../helper/sendVerificationEmail";

// Error
import {
  UserNotFoundError,
  TokenExpiredError,
  EmailAlreadyVerifiedError,
  WaitingForVerificationError,
  FailedSendingEmailError,
} from "../../errors/AuthError/authError";

export async function verifyEmailService(payload: {
  token: string;
  email: string;
}): Promise<boolean> {
  const { token, email } = payload;

  // Sanitize input
  const sanitizedToken = sanitizeString(token);
  const sanitizedEmail = sanitizeEmail(email);

  if (!sanitizedEmail) {
    throw new UserNotFoundError();
  }

  const hashedToken = hashToken(sanitizedToken);

  // Find user by email first (prevent token enumeration)
  const user = await UserRepository.findByEmail(sanitizedEmail);

  if (!user) {
    throw new UserNotFoundError();
  }

  if (user.isVerified) {
    return true;
  }

  // Validate token matches user's token
  if (user.verificationToken !== hashedToken) {
    throw new UserNotFoundError();
  }

  if (
    !user.verificationTokenExpires ||
    new Date() > user.verificationTokenExpires
  ) {
    throw new TokenExpiredError();
  }

  await UserRepository.setVerified(user.id);

  return true;
}

export async function resendVerificationEmailService(
  email: string,
): Promise<boolean> {
  // Sanitize input
  const sanitizedEmail = sanitizeEmail(email);

  const user = await UserRepository.findByEmail(sanitizedEmail);

  if (!user) {
    throw new UserNotFoundError();
  }

  if (user.isVerified) {
    throw new EmailAlreadyVerifiedError();
  }

  // Check cooldown
  if (user.verificationSentAt) {
    const lastSent = user.verificationSentAt.getTime();
    const now = Date.now();
    const cooldownMinutes = 2;

    if (now - lastSent < cooldownMinutes * 60 * 1000) {
      const remainingSeconds = Math.ceil(
        (cooldownMinutes * 60 * 1000 - (now - lastSent)) / 1000,
      );
      throw new WaitingForVerificationError(remainingSeconds);
    }
  }

  if (!user.verificationToken || !user.verificationTokenExpires) {
    throw new UserNotFoundError();
  }

  if (new Date() > user.verificationTokenExpires) {
    throw new TokenExpiredError();
  }

  const plainToken = generateVerificationToken();
  const hashedToken = hashToken(plainToken);
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await UserRepository.updateVerificationToken(
    user.id,
    hashedToken,
    tokenExpires,
  );

  const emailSent = await sendVerificationEmail({
    to: sanitizedEmail,
    token: plainToken,
    username: user.fullname,
  });

  if (!emailSent) {
    throw new FailedSendingEmailError();
  }

  return true;
}

export async function checkVerificationStatusService(email: string) {
  // Sanitize input
  const sanitizedEmail = sanitizeEmail(email);

  const user = await UserRepository.findByEmail(sanitizedEmail);

  if (!user) {
    throw new UserNotFoundError();
  }

  return {
    isVerified: user.isVerified,
    lastSentAt: user.verificationSentAt,
  };
}
