import bcrypt from "bcrypt";
import {
  validatePassword,
  PasswordValidationResult,
} from "../validation/passwordPolicy";

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain password with a hashed password
 */
export async function comparePassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  if (!plain || !hashed) {
    return false;
  }

  try {
    return await bcrypt.compare(plain, hashed);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

/**
 * Validate password strength and policy
 */
export function validatePasswordPolicy(
  password: string,
): PasswordValidationResult {
  return validatePassword(password);
}
