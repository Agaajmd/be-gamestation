"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
/**
 * Middleware untuk verifikasi JWT token
 */
const authenticateToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token tidak ditemukan. Silakan login terlebih dahulu",
            });
            return;
        }
        // Verify token
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json({
                    success: false,
                    message: "Token tidak valid atau expired",
                });
                return;
            }
            // Attach user info to request
            req.user = decoded;
            next();
        });
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat verifikasi token",
        });
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Middleware untuk cek role user
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses untuk resource ini",
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=authMiddleware.js.map