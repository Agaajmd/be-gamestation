"use strict";
/**
 * API Key Management System
 * For protecting internal APIs and cron jobs
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDefaultAPIKeys = exports.apiKeyAuthMiddleware = exports.getAllAPIKeys = exports.deactivateAPIKey = exports.verifyAPIKey = exports.generateAPIKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
// In-memory store - replace with database in production
const apiKeyStore = new Map();
/**
 * Generate a new API key
 * @param name - Name/identifier for the API key
 * @param description - Description of what this key is for
 * @returns The plain key (only shown once) and key metadata
 */
const generateAPIKey = (name, description) => {
    // Generate random key (32 bytes = 256 bits)
    const plainKey = crypto_1.default.randomBytes(32).toString("hex");
    // Hash the key for storage
    const hashedKey = crypto_1.default.createHash("sha256").update(plainKey).digest("hex");
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
exports.generateAPIKey = generateAPIKey;
/**
 * Verify if an API key is valid
 */
const verifyAPIKey = (providedKey) => {
    // Hash the provided key
    const hashedKey = crypto_1.default
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
exports.verifyAPIKey = verifyAPIKey;
/**
 * Deactivate an API key
 */
const deactivateAPIKey = (hashedKey) => {
    const keyRecord = apiKeyStore.get(hashedKey);
    if (!keyRecord) {
        return false;
    }
    keyRecord.isActive = false;
    apiKeyStore.set(hashedKey, keyRecord);
    return true;
};
exports.deactivateAPIKey = deactivateAPIKey;
/**
 * Get all API keys (without plaintext)
 */
const getAllAPIKeys = () => {
    return Array.from(apiKeyStore.values()).map((record) => ({
        key: record.key,
        name: record.name,
        description: record.description,
        createdAt: record.createdAt,
        lastUsedAt: record.lastUsedAt,
        isActive: record.isActive,
    }));
};
exports.getAllAPIKeys = getAllAPIKeys;
const apiKeyAuthMiddleware = (req, res, next) => {
    try {
        // Check for API key in header
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            res.status(401).json({
                success: false,
                message: "API key is required",
            });
            return;
        }
        // Verify the API key
        const keyRecord = (0, exports.verifyAPIKey)(apiKey);
        if (!keyRecord) {
            res.status(401).json({
                success: false,
                message: "Invalid or inactive API key",
            });
            return;
        }
        // Attach key info to request
        req.apiKey = keyRecord;
        next();
    }
    catch (error) {
        console.error("API Key middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.apiKeyAuthMiddleware = apiKeyAuthMiddleware;
/**
 * Initialize default API keys for internal services
 * Call this in your startup script
 */
const initializeDefaultAPIKeys = () => {
    if (apiKeyStore.size === 0) {
        console.log("🔑 Initializing default API keys...");
        // Create key for cron jobs
        const { plainKey: cronKey } = (0, exports.generateAPIKey)("Cron Jobs", "For internal cron job authentication");
        console.log("📌 Cron Jobs API Key:", cronKey);
        // Create key for notification service
        const { plainKey: notificationKey } = (0, exports.generateAPIKey)("Notification Service", "For notification service authentication");
        console.log("📌 Notification Service API Key:", notificationKey);
        console.log("\n⚠️  Save these keys securely! They are only shown once.");
    }
};
exports.initializeDefaultAPIKeys = initializeDefaultAPIKeys;
//# sourceMappingURL=apiKeyManager.js.map