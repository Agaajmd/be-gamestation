// Database
import { prisma } from "../../database";
import { sanitizeString, sanitizeObject } from "../../helper/inputSanitizer";

// Types
interface CreateNotificationPayload {
  userId: bigint;
  type: string;
  channel: string;
  payload: any;
}

interface GetNotificationsPayload {
  userId: bigint;
  userRole: string;
  status?: string;
  type?: string;
}

interface GetNotificationByIdPayload {
  notificationId: bigint;
  userId: bigint;
  userRole: string;
}

interface UpdateNotificationStatusPayload {
  notificationId: bigint;
  userId: bigint;
  status: string;
}

interface DeleteNotificationPayload {
  notificationId: bigint;
  userId: bigint;
}

// Service function to create notification
export async function createNotificationService(
  payload: CreateNotificationPayload,
) {
  const {
    userId,
    type: rawType,
    channel: rawChannel,
    payload: rawPayload,
  } = payload;

  // Sanitize input
  const type = sanitizeString(rawType);
  const channel = sanitizeString(rawChannel);
  const notificationPayload = sanitizeObject(rawPayload);

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  // Create notification
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      channel: channel as any,
      payload: notificationPayload,
      status: "pending",
    },
  });

  return notification;
}

// Service function to get notifications
export async function getNotificationsService(
  payload: GetNotificationsPayload,
) {
  const { userId, userRole, status: rawStatus, type: rawType } = payload;

  // Sanitize input
  const status = rawStatus ? sanitizeString(rawStatus) : undefined;
  const type = rawType ? sanitizeString(rawType) : undefined;

  let notifications;

  if (userRole === "customer") {
    // Customer sees their own notifications
    notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(status && { status: status as any }),
        ...(type && { type }),
      },
      orderBy: {
        id: "desc",
      },
    });
  } else {
    // Admin/Owner sees all notifications
    notifications = await prisma.notification.findMany({
      where: {
        ...(status && { status: status as any }),
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
export async function getNotificationByIdService(
  payload: GetNotificationByIdPayload,
) {
  const { notificationId, userId, userRole } = payload;

  const notification = await prisma.notification.findUnique({
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
export async function updateNotificationStatusService(
  payload: UpdateNotificationStatusPayload,
) {
  const { notificationId, status: rawStatus } = payload;

  // Sanitize input
  const status = sanitizeString(rawStatus);

  // Check if notification exists
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("Notification tidak ditemukan");
  }

  // Only admin/owner can update (verify via context if needed)
  // For now, we'll just update

  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { status: status as any },
  });

  return updated;
}

// Service function to delete notification
export async function deleteNotificationService(
  payload: DeleteNotificationPayload,
) {
  const { notificationId } = payload;

  // Check if notification exists
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("Notification tidak ditemukan");
  }

  // Delete notification
  await prisma.notification.delete({
    where: { id: notificationId },
  });

  return notification;
}
