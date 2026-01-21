import { Request, Response } from "express";

// Services
import {
  createSubscriptionService,
  getSubscriptionsService,
  getSubscriptionByIdService,
  updateSubscriptionService,
  cancelSubscriptionService,
} from "../service/SubscriptionService/subscriptionService";

// Error
import { handleError } from "../helper/responseHelper";

/**
 * Helper function to serialize subscription data
 */
const serializeSubscription = (subscription: any) => {
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
export const createSubscription = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const { plan, price, startsAt, endsAt } = req.body;

    const subscription = await createSubscriptionService({
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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /subscriptions
 * Get subscriptions
 * - Owner: see own subscriptions
 * - Admin: not allowed (403)
 */
export const getSubscriptions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const { status } = req.query;

    const subscriptions = await getSubscriptionsService({
      userId,
      userRole,
      status: status as string | undefined,
    });

    const serialized = subscriptions.map(serializeSubscription);

    res.status(200).json({
      success: true,
      data: serialized,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /subscriptions/:id
 * Get subscription by ID
 */
export const getSubscriptionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const subscriptionId = BigInt(req.params.id);

    const subscription = await getSubscriptionByIdService({
      subscriptionId,
      userId,
      userRole,
    });

    const serialized = serializeSubscription(subscription);

    res.status(200).json({
      success: true,
      data: serialized,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PUT /subscriptions/:id
 * Update subscription
 */
export const updateSubscription = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const subscriptionId = BigInt(req.params.id);

    const updated = await updateSubscriptionService({
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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * PUT /subscriptions/:id/cancel
 * Cancel subscription
 */
export const cancelSubscription = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const userRole = req.user!.role;
    const subscriptionId = BigInt(req.params.id);

    const updated = await cancelSubscriptionService({
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
  } catch (error) {
    handleError(error, res);
  }
};
