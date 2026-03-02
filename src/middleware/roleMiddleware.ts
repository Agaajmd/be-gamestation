import { Request, Response, NextFunction } from "express";

/**
 * Middleware untuk memastikan user adalah Owner
 * Mengharapkan req.user sudah di-set oleh authenticateToken middleware
 */
export const requireOwner = (
  req: Request,
  res: Response,
  next: NextFunction,
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
 * Middleware untuk memastikan user adalah Admin
 * Mengharapkan req.user sudah di-set oleh authenticateToken middleware
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
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
 * Middleware untuk memastikan user adalah Owner atau Admin
 */
export const requireOwnerOrAdminManager = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const isOwner = req.user.role === "owner";
  const isAdminManager =
    req.user.role === "admin" && req.user.adminRole === "manager";

  if (!isOwner && !isAdminManager) {
    res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya owner atau admin yang dapat mengakses",
    });
    return;
  }

  next();
};

export const requireOwnerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const isOwner = req.user.role === "owner";
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
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
  next: NextFunction,
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
