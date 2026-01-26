"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 12;
async function hashPassword(password) {
    return bcrypt_1.default.hash(password, SALT_ROUNDS);
}
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
//# sourceMappingURL=password.js.map