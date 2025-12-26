"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailFromToken = exports.getUserIdFromToken = exports.getRoleFromToken = exports.extractTokenFromHeader = exports.decodeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
/**
 * Helper untuk decode JWT token dan ambil payload
 */
const decodeToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
exports.decodeToken = decodeToken;
/**
 * Helper untuk ambil token dari Authorization header
 */
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader)
        return null;
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
        return null;
    return parts[1];
};
exports.extractTokenFromHeader = extractTokenFromHeader;
/**
 * Helper untuk ambil role dari token
 */
const getRoleFromToken = (token) => {
    const payload = (0, exports.decodeToken)(token);
    return payload ? payload.role : null;
};
exports.getRoleFromToken = getRoleFromToken;
/**
 * Helper untuk ambil userId dari token
 */
const getUserIdFromToken = (token) => {
    const payload = (0, exports.decodeToken)(token);
    return payload ? payload.userId : null;
};
exports.getUserIdFromToken = getUserIdFromToken;
/**
 * Helper untuk ambil email dari token
 */
const getEmailFromToken = (token) => {
    const payload = (0, exports.decodeToken)(token);
    return payload ? payload.email : null;
};
exports.getEmailFromToken = getEmailFromToken;
//# sourceMappingURL=jwtHelper.js.map