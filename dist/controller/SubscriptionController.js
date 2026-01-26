"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelSubscription = exports.updateSubscription = exports.getSubscriptionById = exports.getSubscriptions = exports.createSubscription = void 0;
// Services
const subscriptionService_1 = require("../service/SubscriptionService/subscriptionService");
// Error
const responseHelper_1 = require("../helper/responseHelper");
/**
 * Helper function to serialize subscription data
 */
const serializeSubscription = (subscription) => {
    return {
        ...subscription,
        id: subscription.id?.toString(),
        ownerId: subscription.ownerId?.toString(),
    };
};
/**
 * POST /subscriptions
 * Create subscription (owner only)
 */
const createSubscription = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const { plan, price, startsAt, endsAt } = req.body;
        const subscription = await (0, subscriptionService_1.createSubscriptionService)({
            userId,
            plan,
            price,
            startsAt,
            endsAt,
        });
        const serialized = serializeSubscription(subscription);
        res.status(201).json({
            success: true,
            message: "Subscription berhasil dibuat",
            data: serialized,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.createSubscription = createSubscription;
/**
 * GET /subscriptions
 * Get subscriptions
 * - Owner: see own subscriptions
 * - Admin: not allowed (403)
 */
const getSubscriptions = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const userRole = req.user.role;
        const { status } = req.query;
        const subscriptions = await (0, subscriptionService_1.getSubscriptionsService)({
            userId,
            userRole,
            status: status,
        });
        const serialized = subscriptions.map(serializeSubscription);
        res.status(200).json({
            success: true,
            data: serialized,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getSubscriptions = getSubscriptions;
/**
 * GET /subscriptions/:id
 * Get subscription by ID
 */
const getSubscriptionById = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const userRole = req.user.role;
        const subscriptionId = BigInt(req.params.id);
        const subscription = await (0, subscriptionService_1.getSubscriptionByIdService)({
            subscriptionId,
            userId,
            userRole,
        });
        const serialized = serializeSubscription(subscription);
        res.status(200).json({
            success: true,
            data: serialized,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getSubscriptionById = getSubscriptionById;
/**
 * PUT /subscriptions/:id
 * Update subscription
 */
const updateSubscription = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const userRole = req.user.role;
        const subscriptionId = BigInt(req.params.id);
        const updated = await (0, subscriptionService_1.updateSubscriptionService)({
            subscriptionId,
            userId,
            userRole,
            data: req.body,
        });
        const serialized = serializeSubscription(updated);
        res.status(200).json({
            success: true,
            message: "Subscription berhasil diupdate",
            data: serialized,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateSubscription = updateSubscription;
/**
 * PUT /subscriptions/:id/cancel
 * Cancel subscription
 */
const cancelSubscription = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const userRole = req.user.role;
        const subscriptionId = BigInt(req.params.id);
        const updated = await (0, subscriptionService_1.cancelSubscriptionService)({
            subscriptionId,
            userId,
            userRole,
        });
        const serialized = serializeSubscription(updated);
        res.status(200).json({
            success: true,
            message: "Subscription berhasil dibatalkan",
            data: serialized,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.cancelSubscription = cancelSubscription;
//# sourceMappingURL=SubscriptionController.js.map