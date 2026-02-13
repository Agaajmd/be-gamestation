import { PasswordValidationResult } from "../validation/passwordPolicy";
/**
 * Hash a password using bcrypt
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Compare a plain password with a hashed password
 */
export declare function comparePassword(plain: string, hashed: string): Promise<boolean>;
/**
 * Validate password strength and policy
 */
export declare function validatePasswordPolicy(password: string): PasswordValidationResult;
//# sourceMappingURL=password.d.ts.map