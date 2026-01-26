"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
exports.extractTokenFromHeader = extractTokenFromHeader;
exports.decodeToken = decodeToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Validasi environment variables saat startup
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be defined and at least 32 characters long");
}
if (!JWT_REFRESH_SECRET || JWT_REFRESH_SECRET.length < 32) {
    throw new Error("JWT_REFRESH_SECRET must be defined and at least 32 characters long");
}
if (JWT_SECRET === JWT_REFRESH_SECRET) {
    throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be different");
}
const JWT_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
// Generate tokens
exports.generateToken = {
    accessToken(userId, email, role, adminRole) {
        const payload = {
            userId: userId.toString(),
            email,
            role,
            ...(adminRole && { adminRole }),
        };
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
            issuer: "game-station",
            audience: "users",
        });
    },
    refreshToken(userId, email, role, adminRole) {
        const payload = {
            userId: userId.toString(),
            email,
            role,
            ...(adminRole && { adminRole }),
        };
        return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRES_IN,
            issuer: "game-station",
            audience: "users",
        });
    },
};
// Verify tokens
exports.verifyToken = {
    accessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET, {
                issuer: "game-station",
                audience: "users",
            });
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                ...(decoded.adminRole && { adminRole: decoded.adminRole }),
            };
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new Error("Access token has expired");
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new Error("Invalid access token");
            }
            throw error;
        }
    },
    refreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET, {
                issuer: "game-station",
                audience: "users",
            });
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                ...(decoded.adminRole && { adminRole: decoded.adminRole }),
            };
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new Error("Refresh token has expired");
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new Error("Invalid refresh token");
            }
            throw error;
        }
    },
};
// Helper functions untuk middleware
function extractTokenFromHeader(authHeader) {
    if (!authHeader) {
        return null;
    }
    const parts = authHeader.split(" ");
    // Format: "Bearer <token>"
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return null;
    }
    return parts[1];
}
function decodeToken(token) {
    try {
        return exports.verifyToken.accessToken(token);
    }
    catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
}
//# sourceMappingURL=jwtHelper.js.map