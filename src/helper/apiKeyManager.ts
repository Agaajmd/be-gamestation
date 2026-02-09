/**
 * API Key Management System
 * For protecting internal APIs and cron jobs
 */

import crypto from "crypto";

interface APIKeyRecord {
  key: string; // Hashed key
  name: string;
  description: string;
  createdAt: Date;
  lastUsedAt?: Date;
  isActive: boolean;
  rateLimit?: number;
}

// In-memory store - replace with database in production
const apiKeyStore = new Map<string, APIKeyRecord>();

/**
 * Generate a new API key
 * @param name - Name/identifier for the API key
 * @param description - Description of what this key is for
 * @returns The plain key (only shown once) and key metadata
 */
export const generateAPIKey = (
  name: string,
  description: string,
): { plainKey: string; hashedKey: string } => {
  // Generate random key (32 bytes = 256 bits)
  const plainKey = crypto.randomBytes(32).toString("hex");

  // Hash the key for storage
  const hashedKey = crypto.createHash("sha256").update(plainKey).digest("hex");

  // Store metadata
  apiKeyStore.set(hashedKey, {
    key: hashedKey,
    name,
    description,
    createdAt: new Date(),
    isActive: true,
  });

  return { plainKey, hashedKey };
};

/**
 * Verify if an API key is valid
 */
export const verifyAPIKey = (providedKey: string): APIKeyRecord | null => {
  // Hash the provided key
  const hashedKey = crypto
    .createHash("sha256")
    .update(providedKey)
    .digest("hex");

  // Look up in store
  const keyRecord = apiKeyStore.get(hashedKey);

  if (!keyRecord || !keyRecord.isActive) {
    return null;
  }

  // Update last used timestamp
  keyRecord.lastUsedAt = new Date();
  apiKeyStore.set(hashedKey, keyRecord);

  return keyRecord;
};

/**
 * Deactivate an API key
 */
export const deactivateAPIKey = (hashedKey: string): boolean => {
  const keyRecord = apiKeyStore.get(hashedKey);

  if (!keyRecord) {
    return false;
  }

  keyRecord.isActive = false;
  apiKeyStore.set(hashedKey, keyRecord);

  return true;
};

/**
 * Get all API keys (without plaintext)
 */
export const getAllAPIKeys = () => {
  return Array.from(apiKeyStore.values()).map((record) => ({
    key: record.key,
    name: record.name,
    description: record.description,
    createdAt: record.createdAt,
    lastUsedAt: record.lastUsedAt,
    isActive: record.isActive,
  }));
};

/**
 * API Key authentication middleware
 */
import { Request, Response, NextFunction } from "express";

export const apiKeyAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check for API key in header
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      res.status(401).json({
        success: false,
        message: "API key is required",
      });
      return;
    }

    // Verify the API key
    const keyRecord = verifyAPIKey(apiKey);

    if (!keyRecord) {
      res.status(401).json({
        success: false,
        message: "Invalid or inactive API key",
      });
      return;
    }

    // Attach key info to request
    (req as any).apiKey = keyRecord;

    next();
  } catch (error) {
    console.error("API Key middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Initialize default API keys for internal services
 * Call this in your startup script
 */
export const initializeDefaultAPIKeys = () => {
  if (apiKeyStore.size === 0) {
    console.log("🔑 Initializing default API keys...");

    // Create key for cron jobs
    const { plainKey: cronKey } = generateAPIKey(
      "Cron Jobs",
      "For internal cron job authentication",
    );
    console.log("📌 Cron Jobs API Key:", cronKey);

    // Create key for notification service
    const { plainKey: notificationKey } = generateAPIKey(
      "Notification Service",
      "For notification service authentication",
    );
    console.log("📌 Notification Service API Key:", notificationKey);

    console.log("\n⚠️  Save these keys securely! They are only shown once.");
  }
};
