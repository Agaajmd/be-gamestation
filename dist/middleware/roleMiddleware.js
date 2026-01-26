"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCustomer = exports.requireOwnerOrAdminStaff = exports.requireOwnerOrAdmin = exports.requireAdmin = exports.requireOwner = void 0;
/**
 * Middleware untuk memastikan user adalah Owner
 * Mengharapkan req.user sudah di-set oleh authenticateToken middleware
 */
const requireOwner = (req, res, next) => {
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
exports.requireOwner = requireOwner;
/**
 * Middleware untuk memastikan user adalah Admin
 * Mengharapkan req.user sudah di-set oleh authenticateToken middleware
 */
const requireAdmin = (req, res, next) => {
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
exports.requireAdmin = requireAdmin;
/**
 * Middleware untuk memastikan user adalah Owner atau Admin
 */
const requireOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }
    const isOwner = req.user.role === "owner";
    const isAdminManager = req.user.role === "admin" && req.user.adminRole === "manager";
    if (!isOwner && !isAdminManager) {
        res.status(403).json({
            success: false,
            message: "Akses ditolak. Hanya owner atau admin yang dapat mengakses",
        });
        return;
    }
    next();
};
exports.requireOwnerOrAdmin = requireOwnerOrAdmin;
const requireOwnerOrAdminStaff = (req, res, next) => {
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
exports.requireOwnerOrAdminStaff = requireOwnerOrAdminStaff;
/**
 * Middleware untuk memastikan user adalah Customer
 * Mengharapkan req.user sudah di-set oleh authenticateToken middleware
 */
const requireCustomer = (req, res, next) => {
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
exports.requireCustomer = requireCustomer;
//# sourceMappingURL=roleMiddleware.js.map