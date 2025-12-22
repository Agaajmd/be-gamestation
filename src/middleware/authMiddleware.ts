import { Request, Response, NextFunction } from "express";
import {
  JWTPayload,
  extractTokenFromHeader,
  decodeToken,
} from "../helper/jwtHelper";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware untuk verifikasi JWT token
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token tidak ditemukan. Silakan login terlebih dahulu",
      });
      return;
    }

    // Verify token
    const payload = decodeToken(token);

    if (!payload) {
      res.status(403).json({
        success: false,
        message: "Token tidak valid atau expired",
      });
      return;
    }

    // Attach payload to req.user
    req.user = payload as JWTPayload;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat verifikasi token",
    });
  }
};
