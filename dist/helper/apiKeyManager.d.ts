/**
 * API Key Management System
 * For protecting internal APIs and cron jobs
 */
interface APIKeyRecord {
    key: string;
    name: string;
    description: string;
    createdAt: Date;
    lastUsedAt?: Date;
    isActive: boolean;
    rateLimit?: number;
}
/**
 * Generate a new API key
 * @param name - Name/identifier for the API key
 * @param description - Description of what this key is for
 * @returns The plain key (only shown once) and key metadata
 */
export declare const generateAPIKey: (name: string, description: string) => {
    plainKey: string;
    hashedKey: string;
};
/**
 * Verify if an API key is valid
 */
export declare const verifyAPIKey: (providedKey: string) => APIKeyRecord | null;
/**
 * Deactivate an API key
 */
export declare const deactivateAPIKey: (hashedKey: string) => boolean;
/**
 * Get all API keys (without plaintext)
 */
export declare const getAllAPIKeys: () => {
    key: string;
    name: string;
    description: string;
    createdAt: Date;
    lastUsedAt: Date | undefined;
    isActive: boolean;
}[];
/**
 * API Key authentication middleware
 */
import { Request, Response, NextFunction } from "express";
export declare const apiKeyAuthMiddleware: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Initialize default API keys for internal services
 * Call this in your startup script
 */
export declare const initializeDefaultAPIKeys: () => void;
export {};
//# sourceMappingURL=apiKeyManager.d.ts.map