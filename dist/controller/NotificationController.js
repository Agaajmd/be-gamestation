"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.updateNotificationStatus = exports.getNotificationById = exports.getNotifications = exports.createNotification = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
/**
 * POST /notifications
 * Create notification (admin/owner only)
 */
const createNotification = async (req, res) => {
    try {
        const { userId, type, channel, payload } = req.body;
        const userIdBigInt = BigInt(userId);
        // Verify user exists
        const user = await prisma_1.default.user.findUnique({
            where: { id: userIdBigInt },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
            return;
        }
        // Create notification
        const notification = await prisma_1.default.notification.create({
            data: {
                userId: userIdBigInt,
                type,
                channel,
                payload,
                status: "pending",
            },
        });
        const serializedNotification = JSON.parse(JSON.stringify(notification, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(201).json({
            success: true,
            message: "Notification berhasil dibuat",
            data: serializedNotification,
        });
    }
    catch (error) {
        console.error("Create notification error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat membuat notification",
        });
    }
};
exports.createNotification = createNotification;
/**
 * GET /notifications
 * Get notifications
 * - Customer: see own notifications
 * - Admin/Owner: see all notifications
 */
const getNotifications = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const userRole = req.user.role;
        const { status, type } = req.query;
        let notifications;
        if (userRole === "customer") {
            // Customer sees their own notifications
            notifications = await prisma_1.default.notification.findMany({
                where: {
                    userId: userId,
                    ...(status && { status: status }),
                    ...(type && { type: type }),
                },
                orderBy: {
                    id: "desc",
                },
            });
        }
        else {
            // Admin/Owner sees all notifications
            notifications = await prisma_1.default.notification.findMany({
                where: {
                    ...(status && { status: status }),
                    ...(type && { type: type }),
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    id: "desc",
                },
            });
        }
        const serializedNotifications = JSON.parse(JSON.stringify(notifications, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            data: serializedNotifications,
        });
    }
    catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data notification",
        });
    }
};
exports.getNotifications = getNotifications;
/**
 * GET /notifications/:id
 * Get notification by ID
 */
const getNotificationById = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const userRole = req.user.role;
        const notificationId = BigInt(req.params.id);
        const notification = await prisma_1.default.notification.findUnique({
            where: { id: notificationId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullname: true,
                        email: true,
                    },
                },
            },
        });
        if (!notification) {
            res.status(404).json({
                success: false,
                message: "Notification tidak ditemukan",
            });
            return;
        }
        // Check access rights - customer can only see their own notifications
        if (userRole === "customer" && notification.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke notification ini",
            });
            return;
        }
        const serializedNotification = JSON.parse(JSON.stringify(notification, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            data: serializedNotification,
        });
    }
    catch (error) {
        console.error("Get notification by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data notification",
        });
    }
};
exports.getNotificationById = getNotificationById;
/**
 * PUT /notifications/:id
 * Update notification status (admin/owner only)
 */
const updateNotificationStatus = async (req, res) => {
    try {
        const notificationId = BigInt(req.params.id);
        const { status } = req.body;
        const notification = await prisma_1.default.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            res.status(404).json({
                success: false,
                message: "Notification tidak ditemukan",
            });
            return;
        }
        // Update notification
        const updatedNotification = await prisma_1.default.notification.update({
            where: { id: notificationId },
            data: {
                status,
                ...(status === "sent" && { sentAt: new Date() }),
            },
        });
        const serializedNotification = JSON.parse(JSON.stringify(updatedNotification, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            message: "Notification status berhasil diupdate",
            data: serializedNotification,
        });
    }
    catch (error) {
        console.error("Update notification status error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengupdate notification status",
        });
    }
};
exports.updateNotificationStatus = updateNotificationStatus;
/**
 * DELETE /notifications/:id
 * Delete notification (admin/owner only)
 */
const deleteNotification = async (req, res) => {
    try {
        const notificationId = BigInt(req.params.id);
        const notification = await prisma_1.default.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            res.status(404).json({
                success: false,
                message: "Notification tidak ditemukan",
            });
            return;
        }
        await prisma_1.default.notification.delete({
            where: { id: notificationId },
        });
        res.status(200).json({
            success: true,
            message: "Notification berhasil dihapus",
        });
    }
    catch (error) {
        console.error("Delete notification error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus notification",
        });
    }
};
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=NotificationController.js.map