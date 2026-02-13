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
export declare const validatePassword: (password: string) => PasswordValidationResult;
/**
 * Generate password requirements message
 */
export declare const getPasswordRequirements: () => string;
//# sourceMappingURL=passwordPolicy.d.ts.map