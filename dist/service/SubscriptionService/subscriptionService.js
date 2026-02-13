"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionService = createSubscriptionService;
exports.getSubscriptionsService = getSubscriptionsService;
exports.getSubscriptionByIdService = getSubscriptionByIdService;
exports.updateSubscriptionService = updateSubscriptionService;
exports.cancelSubscriptionService = cancelSubscriptionService;
// Database
const database_1 = require("../../database");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Repository
const ownerRepository_1 = require("../../repository/ownerRepository");
// Service function to create subscription
async function createSubscriptionService(payload) {
    const { userId, plan: rawPlan, price: rawPrice, startsAt, endsAt } = payload;
    // Sanitize input
    const plan = (0, inputSanitizer_1.sanitizeString)(rawPlan);
    const price = (0, inputSanitizer_1.sanitizeNumber)(rawPrice, 0) ?? 0;
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
    const { userId, userRole, status: rawStatus } = payload;
    // Sanitize input
    const status = rawStatus ? (0, inputSanitizer_1.sanitizeString)(rawStatus) : undefined;
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
    const { subscriptionId, userId, userRole, data: rawData } = payload;
    // Sanitize input
    const data = (0, inputSanitizer_1.sanitizeObject)(rawData);
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