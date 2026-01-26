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
export declare function createNotificationService(payload: CreateNotificationPayload): Promise<{
    id: bigint;
    status: import("@prisma/client").$Enums.NotificationStatus;
    userId: bigint;
    type: string;
    channel: import("@prisma/client").$Enums.NotificationChannel;
    payload: import("@prisma/client/runtime/client").JsonValue;
    sentAt: Date | null;
}>;
export declare function getNotificationsService(payload: GetNotificationsPayload): Promise<{
    id: bigint;
    status: import("@prisma/client").$Enums.NotificationStatus;
    userId: bigint;
    type: string;
    channel: import("@prisma/client").$Enums.NotificationChannel;
    payload: import("@prisma/client/runtime/client").JsonValue;
    sentAt: Date | null;
}[]>;
export declare function getNotificationByIdService(payload: GetNotificationByIdPayload): Promise<{
    user: {
        id: bigint;
        email: string;
        fullname: string;
    };
} & {
    id: bigint;
    status: import("@prisma/client").$Enums.NotificationStatus;
    userId: bigint;
    type: string;
    channel: import("@prisma/client").$Enums.NotificationChannel;
    payload: import("@prisma/client/runtime/client").JsonValue;
    sentAt: Date | null;
}>;
export declare function updateNotificationStatusService(payload: UpdateNotificationStatusPayload): Promise<{
    id: bigint;
    status: import("@prisma/client").$Enums.NotificationStatus;
    userId: bigint;
    type: string;
    channel: import("@prisma/client").$Enums.NotificationChannel;
    payload: import("@prisma/client/runtime/client").JsonValue;
    sentAt: Date | null;
}>;
export declare function deleteNotificationService(payload: DeleteNotificationPayload): Promise<{
    id: bigint;
    status: import("@prisma/client").$Enums.NotificationStatus;
    userId: bigint;
    type: string;
    channel: import("@prisma/client").$Enums.NotificationChannel;
    payload: import("@prisma/client/runtime/client").JsonValue;
    sentAt: Date | null;
}>;
export {};
//# sourceMappingURL=notificationService.d.ts.map