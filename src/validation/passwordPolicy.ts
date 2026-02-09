/**
 * Password Policy Validator
 * Enforces secure password requirements
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
  score: number;
}

/**
 * Password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*)
 * - Not common passwords
 */
export const validatePassword = (
  password: string,
): PasswordValidationResult => {
  const errors: string[] = [];
  let score = 0;

  // Check length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else {
    score += 20;
  }

  if (password.length > 20) {
    score += 10;
  }

  // Check uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else {
    score += 20;
  }

  // Check lowercase
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else {
    score += 20;
  }

  // Check numbers
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  } else {
    score += 20;
  }

  // Check special characters
  if (!/[!@#$%^&*()_+\-=[\]{};:'",.<>?/\\|`~]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (!@#$%^&*)",
    );
  } else {
    score += 20;
  }

  // Check for common patterns
  const commonPatterns = [
    /(.)\1{2,}/g, // More than 2 consecutive same characters
    /^123|234|345|456|567|678|789|890/,
    /^abc|bcd|cde|def|efg|fgh|ghi|hij|ijk/i,
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push("Password contains common patterns");
      break;
    }
  }

  // Check common weak passwords
  const commonPasswords = [
    "password",
    "123456",
    "qwerty",
    "admin",
    "letmein",
    "welcome",
    "monkey",
    "dragon",
    "master",
    "sunshine",
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Password is too common and insecure");
  }

  // Determine strength
  let strength: "weak" | "medium" | "strong" = "weak";
  if (errors.length === 0) {
    if (score >= 80) {
      strength = "strong";
    } else if (score >= 60) {
      strength = "medium";
    } else {
      strength = "weak";
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: Math.min(score, 100),
  };
};

/**
 * Generate password requirements message
 */
export const getPasswordRequirements = (): string => {
  return `Password must:
- Be at least 8 characters long
- Contain at least one uppercase letter (A-Z)
- Contain at least one lowercase letter (a-z)
- Contain at least one number (0-9)
- Contain at least one special character (!@#$%^&*)
- Not contain common patterns or weak passwords`;
};
