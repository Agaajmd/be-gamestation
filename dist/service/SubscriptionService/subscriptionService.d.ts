interface CreateSubscriptionPayload {
    userId: bigint;
    plan: string;
    price: number;
    startsAt: string;
    endsAt: string;
}
interface GetSubscriptionsPayload {
    userId: bigint;
    userRole: string;
    status?: string;
}
interface GetSubscriptionByIdPayload {
    subscriptionId: bigint;
    userId: bigint;
    userRole: string;
}
interface UpdateSubscriptionPayload {
    subscriptionId: bigint;
    userId: bigint;
    userRole: string;
    data: any;
}
interface CancelSubscriptionPayload {
    subscriptionId: bigint;
    userId: bigint;
    userRole: string;
}
export declare function createSubscriptionService(payload: CreateSubscriptionPayload): Promise<{
    id: bigint;
    status: import("@prisma/client").$Enums.SubscriptionStatus;
    ownerId: bigint;
    plan: string;
    price: import("@prisma/client-runtime-utils").Decimal;
    startsAt: Date;
    endsAt: Date;
}>;
export declare function getSubscriptionsService(payload: GetSubscriptionsPayload): Promise<{
    id: bigint;
    status: import("@prisma/client").$Enums.SubscriptionStatus;
    ownerId: bigint;
    plan: string;
    price: import("@prisma/client-runtime-utils").Decimal;
    startsAt: Date;
    endsAt: Date;
}[]>;
export declare function getSubscriptionByIdService(payload: GetSubscriptionByIdPayload): Promise<{
    owner: {
        user: {
            id: bigint;
            email: string;
            fullname: string;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date | null;
        userId: bigint;
        companyName: string;
    };
} & {
    id: bigint;
    status: import("@prisma/client").$Enums.SubscriptionStatus;
    ownerId: bigint;
    plan: string;
    price: import("@prisma/client-runtime-utils").Decimal;
    startsAt: Date;
    endsAt: Date;
}>;
export declare function updateSubscriptionService(payload: UpdateSubscriptionPayload): Promise<{
    id: bigint;
    status: import("@prisma/client").$Enums.SubscriptionStatus;
    ownerId: bigint;
    plan: string;
    price: import("@prisma/client-runtime-utils").Decimal;
    startsAt: Date;
    endsAt: Date;
}>;
export declare function cancelSubscriptionService(payload: CancelSubscriptionPayload): Promise<{
    id: bigint;
    status: import("@prisma/client").$Enums.SubscriptionStatus;
    ownerId: bigint;
    plan: string;
    price: import("@prisma/client-runtime-utils").Decimal;
    startsAt: Date;
    endsAt: Date;
}>;
export {};
//# sourceMappingURL=subscriptionService.d.ts.map