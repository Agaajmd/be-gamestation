import { Request, Response, NextFunction } from "express";
import { extractTokenFromHeader, decodeToken } from "../helper/jwtHelper";

/**
 * Middleware untuk memastikan user adalah Owner
 * Mengharapkan req.user sudah di-set oleh authenticateToken middleware
 */
export const requireOwner = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  if (req.user.role !== "owner") {
    res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya owner yang dapat mengakses",
    });
    return;
  }

  next();
};

/**
 * Middleware standalone untuk cek apakah user adalah Owner
 * Langsung decode token tanpa perlu authenticateToken middleware
 */
export const isOwner = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token tidak ditemukan. Silakan login terlebih dahulu",
      });
      return;
    }

    const payload = decodeToken(token);

    if (!payload) {
      res.status(403).json({
        success: false,
        message: "Token tidak valid atau expired",
      });
      return;
    }

    if (payload.role !== "owner") {
      res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya Owner yang dapat mengakses resource ini",
      });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error("IsOwner middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat verifikasi akses",
    });
  }
};

/**
 * Middleware untuk memastikan user adalah Admin
 * Mengharapkan req.user sudah di-set oleh authenticateToken middleware
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya admin yang dapat mengakses",
    });
    return;
  }

  next();
};

/**
 * Middleware standalone untuk cek apakah user adalah Admin
 * Langsung decode token tanpa perlu authenticateToken middleware
 */
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token tidak ditemukan. Silakan login terlebih dahulu",
      });
      return;
    }

    const payload = decodeToken(token);

    if (!payload) {
      res.status(403).json({
        success: false,
        message: "Token tidak valid atau expired",
      });
      return;
    }

    if (payload.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya Admin yang dapat mengakses resource ini",
      });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error("IsAdmin middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat verifikasi akses",
    });
  }
};

/**
 * Middleware untuk memastikan user adalah Owner atau Admin
 */
export const requireOwnerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  if (req.user.role !== "owner" && req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya owner atau admin yang dapat mengakses",
    });
    return;
  }

  next();
};

/**
 * Middleware untuk memastikan user adalah Customer
 * Mengharapkan req.user sudah di-set oleh authenticateToken middleware
 */
export const requireCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  if (req.user.role !== "customer") {
    res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya customer yang dapat mengakses",
    });
    return;
  }

  next();
};

/**
 * Middleware standalone untuk cek apakah user adalah Customer
 * Langsung decode token tanpa perlu authenticateToken middleware
 */
export const isCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token tidak ditemukan. Silakan login terlebih dahulu",
      });
      return;
    }

    const payload = decodeToken(token);

    if (!payload) {
      res.status(403).json({
        success: false,
        message: "Token tidak valid atau expired",
      });
      return;
    }

    if (payload.role !== "customer") {
      res.status(403).json({
        success: false,
        message:
          "Akses ditolak. Hanya Customer yang dapat mengakses resource ini",
      });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error("IsCustomer middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat verifikasi akses",
    });
  }
};
