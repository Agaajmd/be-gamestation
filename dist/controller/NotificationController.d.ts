import { Request, Response } from "express";
/**
 * POST /notifications
 * Create notification (admin/owner only)
 */
export declare const createNotification: (req: Request, res: Response) => Promise<void>;
/**
 * GET /notifications
 * Get notifications
 * - Customer: see own notifications
 * - Admin/Owner: see all notifications
 */
export declare const getNotifications: (req: Request, res: Response) => Promise<void>;
/**
 * GET /notifications/:id
 * Get notification by ID
 */
export declare const getNotificationById: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /notifications/:id
 * Update notification status (admin/owner only)
 */
export declare const updateNotificationStatus: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /notifications/:id
 * Delete notification
 */
export declare const deleteNotification: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=NotificationController.d.ts.map