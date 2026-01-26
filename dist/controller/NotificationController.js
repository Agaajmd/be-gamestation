"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.updateNotificationStatus = exports.getNotificationById = exports.getNotifications = exports.createNotification = void 0;
// Services
const notificationService_1 = require("../service/NotificationService/notificationService");
// Error
const responseHelper_1 = require("../helper/responseHelper");
/**
 * Helper function to serialize notification data
 */
const serializeNotification = (notification) => {
    return {
        ...notification,
        id: notification.id?.toString(),
        userId: notification.userId?.toString(),
    };
};
/**
 * POST /notifications
 * Create notification (admin/owner only)
 */
const createNotification = async (req, res) => {
    try {
        const { userId, type, channel, payload } = req.body;
        const notification = await (0, notificationService_1.createNotificationService)({
            userId: BigInt(userId),
            type,
            channel,
            payload,
        });
        const serialized = serializeNotification(notification);
        res.status(201).json({
            success: true,
            message: "Notification berhasil dibuat",
            data: serialized,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
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
        const notifications = await (0, notificationService_1.getNotificationsService)({
            userId,
            userRole,
            status: status,
            type: type,
        });
        const serialized = notifications.map(serializeNotification);
        res.status(200).json({
            success: true,
            data: serialized,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
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
        const notification = await (0, notificationService_1.getNotificationByIdService)({
            notificationId,
            userId,
            userRole,
        });
        const serialized = serializeNotification(notification);
        res.status(200).json({
            success: true,
            data: serialized,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
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
        const userId = BigInt(req.user.userId);
        const { status } = req.body;
        const updated = await (0, notificationService_1.updateNotificationStatusService)({
            notificationId,
            userId,
            status,
        });
        const serialized = serializeNotification(updated);
        res.status(200).json({
            success: true,
            message: "Status notification berhasil diubah",
            data: serialized,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateNotificationStatus = updateNotificationStatus;
/**
 * DELETE /notifications/:id
 * Delete notification
 */
const deleteNotification = async (req, res) => {
    try {
        const notificationId = BigInt(req.params.id);
        const userId = BigInt(req.user.userId);
        await (0, notificationService_1.deleteNotificationService)({
            notificationId,
            userId,
        });
        res.status(200).json({
            success: true,
            message: "Notification berhasil dihapus",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=NotificationController.js.map