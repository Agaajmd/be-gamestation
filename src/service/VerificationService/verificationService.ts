// Repository
import { UserRepository } from "../../repository/userRepository";
import { sanitizeString, sanitizeEmail } from "../../helper/inputSanitizer";

// Helper
import {
  generateVerificationToken,
  generateMagicKey,
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
  key: string; 
}): Promise<boolean> {
  const { key } = payload;

  // Sanitize input
  const sanitizedKey = sanitizeString(key);

  // Find user by verification key (magic key)
  const user = await UserRepository.findByVerificationKey(sanitizedKey);

  if (!user) {
    throw new UserNotFoundError();
  }

  if (user.isVerified) {
    return true;
  }

  // Validate token still valid
  if (
    !user.verificationToken ||
    !user.verificationTokenExpires ||
    new Date() > user.verificationTokenExpires
  ) {
    throw new TokenExpiredError();
  }

  // Set verified and clear verification data
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

  // Generate new token and magic key
  const plainToken = generateVerificationToken();
  const hashedToken = hashToken(plainToken);
  const magicKey = generateMagicKey();
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Update both token and key
  await UserRepository.updateVerificationTokenAndKey(
    user.id,
    hashedToken,
    magicKey,
    tokenExpires,
  );

  const emailSent = await sendVerificationEmail({
    to: sanitizedEmail,
    key: magicKey, // Send magic key, not token
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
