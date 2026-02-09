import { UserRole } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envConfig } from "../config/envValidator";

// Use validated environment config
const JWT_SECRET = envConfig.JWT_SECRET;
const JWT_REFRESH_SECRET = envConfig.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = envConfig.JWT_ACCESS_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = envConfig.JWT_REFRESH_EXPIRES_IN;

// Interface untuk payload
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  adminRole?: string;
}

// Alias untuk dipakai di middleware
export type JWTPayload = TokenPayload;

// Generate tokens
export const generateToken = {
  accessToken(
    userId: bigint,
    email: string,
    role: UserRole,
    adminRole?: string,
  ): string {
    const payload: TokenPayload = {
      userId: userId.toString(),
      email,
      role,
      ...(adminRole && { adminRole }),
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "game-station",
      audience: "users",
    } as any);
  },

  refreshToken(
    userId: bigint,
    email: string,
    role: UserRole,
    adminRole?: string,
  ): string {
    const payload: TokenPayload = {
      userId: userId.toString(),
      email,
      role,
      ...(adminRole && { adminRole }),
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: "game-station",
      audience: "users",
    } as any);
  },
};

// Verify tokens
export const verifyToken = {
  accessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: "game-station",
        audience: "users",
      }) as JwtPayload;

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        ...(decoded.adminRole && { adminRole: decoded.adminRole }),
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Access token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid access token");
      }
      throw error;
    }
  },

  refreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: "game-station",
        audience: "users",
      }) as JwtPayload;

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        ...(decoded.adminRole && { adminRole: decoded.adminRole }),
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Refresh token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid refresh token");
      }
      throw error;
    }
  },
};

// Helper functions untuk middleware
export function extractTokenFromHeader(
  authHeader: string | undefined,
): string | null {
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

export function decodeToken(token: string): TokenPayload | null {
  try {
    return verifyToken.accessToken(token);
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}
