import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../helper/jwtHelper";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

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
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token tidak ditemukan. Silakan login terlebih dahulu",
      });
      return;
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: "Token tidak valid atau expired",
        });
        return;
      }

      // Attach user info to request
      req.user = decoded as JWTPayload;
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat verifikasi token",
    });
  }
};

