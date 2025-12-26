"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwtHelper_1 = require("../helper/jwtHelper");
/**
 * Middleware untuk verifikasi JWT token
 */
const authenticateToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        const token = (0, jwtHelper_1.extractTokenFromHeader)(authHeader);
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token tidak ditemukan. Silakan login terlebih dahulu",
            });
            return;
        }
        // Verify token
        const payload = (0, jwtHelper_1.decodeToken)(token);
        if (!payload) {
            res.status(403).json({
                success: false,
                message: "Token tidak valid atau expired",
            });
            return;
        }
        // Attach payload to req.user
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
//# sourceMappingURL=authMiddleware.js.map