"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.validatePasswordPolicy = validatePasswordPolicy;
const bcrypt_1 = __importDefault(require("bcrypt"));
const passwordPolicy_1 = require("../validation/passwordPolicy");
const SALT_ROUNDS = 12;
/**
 * Hash a password using bcrypt
 */
async function hashPassword(password) {
    return bcrypt_1.default.hash(password, SALT_ROUNDS);
}
/**
 * Compare a plain password with a hashed password
 */
async function comparePassword(plain, hashed) {
    if (!plain || !hashed) {
        return false;
    }
    try {
        return await bcrypt_1.default.compare(plain, hashed);
    }
    catch (error) {
        console.error("Password comparison error:", error);
        return false;
    }
}
/**
 * Validate password strength and policy
 */
function validatePasswordPolicy(password) {
    return (0, passwordPolicy_1.validatePassword)(password);
}
//# sourceMappingURL=password.js.map