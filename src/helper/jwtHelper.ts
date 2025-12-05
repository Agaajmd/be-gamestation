import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Helper untuk decode JWT token dan ambil payload
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Helper untuk ambil token dari Authorization header
 */
export const extractTokenFromHeader = (
  authHeader: string | undefined
): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1];
};

/**
 * Helper untuk ambil role dari token
 */
export const getRoleFromToken = (token: string): string | null => {
  const payload = decodeToken(token);
  return payload ? payload.role : null;
};

/**
 * Helper untuk ambil userId dari token
 */
export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeToken(token);
  return payload ? payload.userId : null;
};

/**
 * Helper untuk ambil email dari token
 */
export const getEmailFromToken = (token: string): string | null => {
  const payload = decodeToken(token);
  return payload ? payload.email : null;
};
