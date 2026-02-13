"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationService = createNotificationService;
exports.getNotificationsService = getNotificationsService;
exports.getNotificationByIdService = getNotificationByIdService;
exports.updateNotificationStatusService = updateNotificationStatusService;
exports.deleteNotificationService = deleteNotificationService;
// Database
const database_1 = require("../../database");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Service function to create notification
async function createNotificationService(payload) {
    const { userId, type: rawType, channel: rawChannel, payload: rawPayload, } = payload;
    // Sanitize input
    const type = (0, inputSanitizer_1.sanitizeString)(rawType);
    const channel = (0, inputSanitizer_1.sanitizeString)(rawChannel);
    const notificationPayload = (0, inputSanitizer_1.sanitizeObject)(rawPayload);
    // Verify user exists
    const user = await database_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error("User tidak ditemukan");
    }
    // Create notification
    const notification = await database_1.prisma.notification.create({
        data: {
            userId,
            type,
            channel: channel,
            payload: notificationPayload,
            status: "pending",
        },
    });
    return notification;
}
// Service function to get notifications
async function getNotificationsService(payload) {
    const { userId, userRole, status: rawStatus, type: rawType } = payload;
    // Sanitize input
    const status = rawStatus ? (0, inputSanitizer_1.sanitizeString)(rawStatus) : undefined;
    const type = rawType ? (0, inputSanitizer_1.sanitizeString)(rawType) : undefined;
    let notifications;
    if (userRole === "customer") {
        // Customer sees their own notifications
        notifications = await database_1.prisma.notification.findMany({
            where: {
                userId,
                ...(status && { status: status }),
                ...(type && { type }),
            },
            orderBy: {
                id: "desc",
            },
        });
    }
    else {
        // Admin/Owner sees all notifications
        notifications = await database_1.prisma.notification.findMany({
            where: {
                ...(status && { status: status }),
                ...(type && { type }),
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
    return notifications;
}
// Service function to get notification by ID
async function getNotificationByIdService(payload) {
    const { notificationId, userId, userRole } = payload;
    const notification = await database_1.prisma.notification.findUnique({
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
        throw new Error("Notification tidak ditemukan");
    }
    // Check access rights - customer can only see their own notifications
    if (userRole === "customer" && notification.userId !== userId) {
        throw new Error("Anda tidak memiliki akses ke notification ini");
    }
    return notification;
}
// Service function to update notification status
async function updateNotificationStatusService(payload) {
    const { notificationId, status: rawStatus } = payload;
    // Sanitize input
    const status = (0, inputSanitizer_1.sanitizeString)(rawStatus);
    // Check if notification exists
    const notification = await database_1.prisma.notification.findUnique({
        where: { id: notificationId },
    });
    if (!notification) {
        throw new Error("Notification tidak ditemukan");
    }
    // Only admin/owner can update (verify via context if needed)
    // For now, we'll just update
    const updated = await database_1.prisma.notification.update({
        where: { id: notificationId },
        data: { status: status },
    });
    return updated;
}
// Service function to delete notification
async function deleteNotificationService(payload) {
    const { notificationId } = payload;
    // Check if notification exists
    const notification = await database_1.prisma.notification.findUnique({
        where: { id: notificationId },
    });
    if (!notification) {
        throw new Error("Notification tidak ditemukan");
    }
    // Delete notification
    await database_1.prisma.notification.delete({
        where: { id: notificationId },
    });
    return notification;
}
//# sourceMappingURL=notificationService.js.map