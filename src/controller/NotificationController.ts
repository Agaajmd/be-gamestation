import { Request, Response } from "express";

// Services
import {
  createNotificationService,
  getNotificationsService,
  getNotificationByIdService,
  updateNotificationStatusService,
  deleteNotificationService,
} from "../service/NotificationService/notificationService";

// Error
import { handleError } from "../helper/responseHelper";

/**
 * Helper function to serialize notification data
 */
const serializeNotification = (notification: any) => {
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
export const createNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, type, channel, payload } = req.body;

    const notification = await createNotificationService({
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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /notifications
 * Get notifications
 * - Customer: see own notifications
 * - Admin/Owner: see all notifications
 */
export const getNotifications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const { status, type } = req.query;

    const notifications = await getNotificationsService({
      userId,
      userRole,
      status: status as string | undefined,
      type: type as string | undefined,
    });

    const serialized = notifications.map(serializeNotification);

    res.status(200).json({
      success: true,
      data: serialized,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /notifications/:id
 * Get notification by ID
 */
export const getNotificationById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const notificationId = BigInt(req.params.id);

    const notification = await getNotificationByIdService({
      notificationId,
      userId,
      userRole,
    });

    const serialized = serializeNotification(notification);

    res.status(200).json({
      success: true,
      data: serialized,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PUT /notifications/:id
 * Update notification status (admin/owner only)
 */
export const updateNotificationStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const notificationId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);
    const { status } = req.body;

    const updated = await updateNotificationStatusService({
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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * DELETE /notifications/:id
 * Delete notification
 */
export const deleteNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const notificationId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);

    await deleteNotificationService({
      notificationId,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Notification berhasil dihapus",
    });
  } catch (error) {
    handleError(error, res);
  }
};
