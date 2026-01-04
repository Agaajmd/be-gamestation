import crypto from "crypto";
import bcrypt from "bcrypt";

// Temporary OTP storage (in-memory). In production, use a persistent store like Redis or a database.
const otpStore = new Map<
  string,
  { otp: string; expiresAt: Date; attempts: number }
>();

// Use secure random generation for OTP
function generateSecureOTP(length: number = 6): string {
  // Untuk 6 digit: 100000 - 999999
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return crypto.randomInt(min, max + 1).toString();
}

// Hash OTP before storing
export async function generateAndStoreOTP(email: string) {
  const otp = generateSecureOTP(6);
  const hashedOTP = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Store the hashed OTP, not the plaintext
  otpStore.set(email, {
    otp: hashedOTP,
    expiresAt,
    attempts: 0, // Track attempts for rate limiting
  });

  return otp; // Return plaintext to send to user
}

// Verify OTP
export async function verifyOTP(email: string, inputOTP: string): Promise<boolean> {
  const stored = otpStore.get(email);

  if (!stored) {
    return false;
  }

  // Check expiry
  if (new Date() > stored.expiresAt) {
    otpStore.delete(email);
    return false;
  }

  // Check attempts (max 3 attempts)
  if (stored.attempts >= 3) {
    otpStore.delete(email);
    throw new Error("Too many failed attempts");
  }

  // Compare OTP
  const isValid = await bcrypt.compare(inputOTP, stored.otp);

  if (!isValid) {
    stored.attempts++;
    return false;
  }

  // Valid! Delete OTP
  otpStore.delete(email);
  return true;
}
