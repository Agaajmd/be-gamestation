"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionService = createSubscriptionService;
exports.getSubscriptionsService = getSubscriptionsService;
exports.getSubscriptionByIdService = getSubscriptionByIdService;
exports.updateSubscriptionService = updateSubscriptionService;
exports.cancelSubscriptionService = cancelSubscriptionService;
// Database
const database_1 = require("../../database");
// Repository
const ownerRepository_1 = require("../../repository/ownerRepository");
// Service function to create subscription
async function createSubscriptionService(payload) {
    const { userId, plan, price, startsAt, endsAt } = payload;
    // Verify owner exists
    const owner = await ownerRepository_1.OwnerRepository.findByUserId(userId);
    if (!owner) {
        throw new Error("Owner profile tidak ditemukan");
    }
    // Create subscription
    const subscription = await database_1.prisma.subscription.create({
        data: {
            ownerId: owner.id,
            plan,
            price,
            startsAt: new Date(startsAt),
            endsAt: new Date(endsAt),
            status: "active",
        },
    });
    return subscription;
}
// Service function to get subscriptions
async function getSubscriptionsService(payload) {
    const { userId, userRole, status } = payload;
    if (userRole !== "owner") {
        throw new Error("Hanya owner yang dapat mengakses subscription");
    }
    // Get owner
    const owner = await ownerRepository_1.OwnerRepository.findByUserId(userId);
    if (!owner) {
        throw new Error("Owner profile tidak ditemukan");
    }
    const subscriptions = await database_1.prisma.subscription.findMany({
        where: {
            ownerId: owner.id,
            ...(status && { status: status }),
        },
        orderBy: {
            startsAt: "desc",
        },
    });
    return subscriptions;
}
// Service function to get subscription by ID
async function getSubscriptionByIdService(payload) {
    const { subscriptionId, userId, userRole } = payload;
    if (userRole !== "owner") {
        throw new Error("Hanya owner yang dapat mengakses subscription");
    }
    const subscription = await database_1.prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: {
            owner: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
    if (!subscription) {
        throw new Error("Subscription tidak ditemukan");
    }
    // Check if subscription belongs to the owner
    const owner = await ownerRepository_1.OwnerRepository.findByUserId(userId);
    if (!owner || subscription.ownerId !== owner.id) {
        throw new Error("Anda tidak memiliki akses ke subscription ini");
    }
    return subscription;
}
// Service function to update subscription
async function updateSubscriptionService(payload) {
    const { subscriptionId, userId, userRole, data } = payload;
    if (userRole !== "owner") {
        throw new Error("Hanya owner yang dapat mengakses subscription");
    }
    const subscription = await database_1.prisma.subscription.findUnique({
        where: { id: subscriptionId },
    });
    if (!subscription) {
        throw new Error("Subscription tidak ditemukan");
    }
    // Check if subscription belongs to the owner
    const owner = await ownerRepository_1.OwnerRepository.findByUserId(userId);
    if (!owner || subscription.ownerId !== owner.id) {
        throw new Error("Anda tidak memiliki akses ke subscription ini");
    }
    const updated = await database_1.prisma.subscription.update({
        where: { id: subscriptionId },
        data,
    });
    return updated;
}
// Service function to cancel subscription
async function cancelSubscriptionService(payload) {
    const { subscriptionId, userId, userRole } = payload;
    if (userRole !== "owner") {
        throw new Error("Hanya owner yang dapat mengakses subscription");
    }
    const subscription = await database_1.prisma.subscription.findUnique({
        where: { id: subscriptionId },
    });
    if (!subscription) {
        throw new Error("Subscription tidak ditemukan");
    }
    // Check if subscription belongs to the owner
    const owner = await ownerRepository_1.OwnerRepository.findByUserId(userId);
    if (!owner || subscription.ownerId !== owner.id) {
        throw new Error("Anda tidak memiliki akses ke subscription ini");
    }
    const updated = await database_1.prisma.subscription.update({
        where: { id: subscriptionId },
        data: { status: "cancelled" },
    });
    return updated;
}
//# sourceMappingURL=subscriptionService.js.map