// Database
import { prisma } from "../../database";
import {
  sanitizeString,
  sanitizeNumber,
  sanitizeObject,
} from "../../helper/inputSanitizer";

// Repository
import { OwnerRepository } from "../../repository/ownerRepository";

// Types
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

// Service function to create subscription
export async function createSubscriptionService(
  payload: CreateSubscriptionPayload,
) {
  const { userId, plan: rawPlan, price: rawPrice, startsAt, endsAt } = payload;

  // Sanitize input
  const plan = sanitizeString(rawPlan);
  const price = sanitizeNumber(rawPrice, 0) ?? 0;

  // Verify owner exists
  const owner = await OwnerRepository.findByUserId(userId);

  if (!owner) {
    throw new Error("Owner profile tidak ditemukan");
  }

  // Create subscription
  const subscription = await prisma.subscription.create({
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
export async function getSubscriptionsService(
  payload: GetSubscriptionsPayload,
) {
  const { userId, userRole, status: rawStatus } = payload;

  // Sanitize input
  const status = rawStatus ? sanitizeString(rawStatus) : undefined;

  if (userRole !== "owner") {
    throw new Error("Hanya owner yang dapat mengakses subscription");
  }

  // Get owner
  const owner = await OwnerRepository.findByUserId(userId);

  if (!owner) {
    throw new Error("Owner profile tidak ditemukan");
  }

  const subscriptions = await prisma.subscription.findMany({
    where: {
      ownerId: owner.id,
      ...(status && { status: status as any }),
    },
    orderBy: {
      startsAt: "desc",
    },
  });

  return subscriptions;
}

// Service function to get subscription by ID
export async function getSubscriptionByIdService(
  payload: GetSubscriptionByIdPayload,
) {
  const { subscriptionId, userId, userRole } = payload;

  if (userRole !== "owner") {
    throw new Error("Hanya owner yang dapat mengakses subscription");
  }

  const subscription = await prisma.subscription.findUnique({
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
  const owner = await OwnerRepository.findByUserId(userId);

  if (!owner || subscription.ownerId !== owner.id) {
    throw new Error("Anda tidak memiliki akses ke subscription ini");
  }

  return subscription;
}

// Service function to update subscription
export async function updateSubscriptionService(
  payload: UpdateSubscriptionPayload,
) {
  const { subscriptionId, userId, userRole, data: rawData } = payload;

  // Sanitize input
  const data = sanitizeObject(rawData);

  if (userRole !== "owner") {
    throw new Error("Hanya owner yang dapat mengakses subscription");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!subscription) {
    throw new Error("Subscription tidak ditemukan");
  }

  // Check if subscription belongs to the owner
  const owner = await OwnerRepository.findByUserId(userId);

  if (!owner || subscription.ownerId !== owner.id) {
    throw new Error("Anda tidak memiliki akses ke subscription ini");
  }

  const updated = await prisma.subscription.update({
    where: { id: subscriptionId },
    data,
  });

  return updated;
}

// Service function to cancel subscription
export async function cancelSubscriptionService(
  payload: CancelSubscriptionPayload,
) {
  const { subscriptionId, userId, userRole } = payload;

  if (userRole !== "owner") {
    throw new Error("Hanya owner yang dapat mengakses subscription");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!subscription) {
    throw new Error("Subscription tidak ditemukan");
  }

  // Check if subscription belongs to the owner
  const owner = await OwnerRepository.findByUserId(userId);

  if (!owner || subscription.ownerId !== owner.id) {
    throw new Error("Anda tidak memiliki akses ke subscription ini");
  }

  const updated = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: "cancelled" },
  });

  return updated;
}
