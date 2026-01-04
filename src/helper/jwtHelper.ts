import jwt, { JwtPayload } from "jsonwebtoken";

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

// Interface untuk payload
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

// Alias untuk dipakai di middleware
export type JWTPayload = TokenPayload;

// Generate tokens
export const generateToken = {
  accessToken(userId: bigint, email: string, role: string): string {
    const payload: TokenPayload = {
      userId: userId.toString(),
      email,
      role,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "game-station",
      audience: "users",
    } as any);
  },

  refreshToken(userId: bigint, email: string, role: string): string {
    const payload: TokenPayload = {
      userId: userId.toString(),
      email,
      role,
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
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
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