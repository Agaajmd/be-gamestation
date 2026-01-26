"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const jwtHelper_1 = require("../helper/jwtHelper");
/**
 * Middleware untuk verifikasi JWT token
 */
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = (0, jwtHelper_1.extractTokenFromHeader)(authHeader);
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token tidak ditemukan. Silakan login terlebih dahulu",
            });
            return;
        }
        const payload = (0, jwtHelper_1.decodeToken)(token);
        if (!payload) {
            res.status(403).json({
                success: false,
                message: "Token tidak valid atau expired",
            });
            return;
        }
        req.user = payload;
        next();
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
 * Middleware untuk verifikasi role
 */
const requireRole = (...allowedRoles) => {
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
                message: "Akses ditolak. Role tidak sesuai",
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=authMiddleware.js.map