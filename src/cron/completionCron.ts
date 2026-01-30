// cron/completionCron.ts
import { prisma } from "../database";
import { createLogger } from "../helper/logger";

const logger = createLogger("completion-cron");

let isProcessing = false;
let intervalId: NodeJS.Timeout | null = null;
let isShuttingDown = false;

export async function processCompletions() {
  const jobId = `job-${Date.now()}`;
  const startTime = Date.now();

  if (isShuttingDown) {
    logger.info({ jobId }, "Shutdown in progress, skipping job");
    return;
  }

  if (isProcessing) {
    logger.warn({ jobId }, "Previous job still running, skipping execution");
    return;
  }

  isProcessing = true;
  const now = new Date();

  logger.info({ jobId }, "Starting completion processing");

  try {
    const orders = await prisma.order.findMany({
      take: 50,
      where: {
        status: { in: ["pending", "confirmed"] },
        orderItems: { every: { bookingEnd: { lte: now } } },
      },
      include: { orderItems: true },
    });

    if (orders.length === 0) {
      logger.debug({ jobId }, "No orders to process");
      return;
    }

    logger.info(
      {
        jobId,
        orderCount: orders.length,
        batchSize: 50,
      },
      "Processing orders batch",
    );

    let successCount = 0;
    let errorCount = 0;
    const failedOrders: string[] = [];

    for (const order of orders) {
      try {
        await processOrder(order, now, jobId);
        successCount++;

        logger.debug(
          {
            jobId,
            orderId: order.id,
            orderCode: order.orderCode,
          },
          "Order processed successfully",
        );
      } catch (error) {
        errorCount++;
        failedOrders.push(order.orderCode);

        logger.error(
          {
            jobId,
            orderId: order.id,
            orderCode: order.orderCode,
            err: error,
          },
          "Failed to process order",
        );

        try {
          await prisma.failedJob.create({
            data: {
              jobType: "order_completion",
              entityId: order.id,
              entityType: "Order",
              error: error instanceof Error ? error.message : String(error),
              stackTrace: error instanceof Error ? error.stack : null,
              payload: JSON.stringify({
                orderCode: order.orderCode,
                customerId: order.customerId,
                jobId,
              }),
              status: "failed",
              attempts: 1,
            },
          });
        } catch (dlqError) {
          logger.error(
            {
              jobId,
              orderId: order.id,
              err: dlqError,
            },
            "Failed to create dead letter queue record",
          );
        }
      }
    }

    const duration = Date.now() - startTime;

    logger.info(
      {
        jobId,
        duration,
        totalOrders: orders.length,
        successCount,
        errorCount,
        ...(failedOrders.length > 0 && { failedOrders }),
      },
      "Batch processing completed",
    );

    if (errorCount > orders.length * 0.5) {
      logger.warn(
        {
          jobId,
          errorRate: ((errorCount / orders.length) * 100).toFixed(2),
          failedOrders,
        },
        "High error rate detected - check database connection",
      );
    }
  } catch (error) {
    logger.error(
      {
        jobId,
        err: error,
      },
      "Critical error in completion processing",
    );
  } finally {
    isProcessing = false;
    logger.debug({ jobId }, "Job lock released");
  }
}

async function processOrder(order: any, now: Date, jobId: string) {
  if (process.env.NODE_ENV === "development") {
    logger.info({ jobId, orderId: order.id }, "⏱️ Simulating 8s delay...");
    await new Promise((resolve) => setTimeout(resolve, 8000));
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$transaction(
        async (tx) => {
          await tx.order.update({
            where: { id: order.id },
            data: { status: "completed" },
          });

          const existingSession = await tx.session.findFirst({
            where: {
              orderId: order.id,
              status: "running",
            },
          });

          if (existingSession) {
            await tx.session.update({
              where: { id: existingSession.id },
              data: {
                status: "stopped",
                endedAt: now,
              },
            });

            logger.debug(
              {
                jobId,
                orderId: order.id,
                sessionId: existingSession.id,
              },
              "Session stopped",
            );
          }

          let devicesReleased = 0;
          for (const item of order.orderItems) {
            const hasOtherActiveOrder = await tx.orderItem.findFirst({
              where: {
                roomAndDeviceId: item.roomAndDeviceId,
                order: {
                  status: { in: ["pending", "confirmed"] },
                  id: { not: order.id },
                  orderItems: {
                    some: {
                      bookingEnd: { gt: now },
                    },
                  },
                },
              },
            });

            if (!hasOtherActiveOrder) {
              await tx.roomAndDevice.update({
                where: { id: item.roomAndDeviceId },
                data: { status: "available" },
              });
              devicesReleased++;
            }
          }

          if (devicesReleased > 0) {
            logger.debug(
              {
                jobId,
                orderId: order.id,
                devicesReleased,
                totalDevices: order.orderItems.length,
              },
              "Devices released",
            );
          }

          try {
            await tx.notification.create({
              data: {
                userId: order.customerId,
                type: "order_completed",
                channel: "email",
                payload: {
                  subject: "Order Completed",
                  message:
                    "Pesanan Anda telah selesai. Terima kasih telah bermain di Game Station kami!",
                  orderCode: order.orderCode,
                } as any,
                status: "pending",
              },
            });

            logger.debug(
              {
                jobId,
                orderId: order.id,
                userId: order.customerId,
              },
              "Notification created",
            );
          } catch (notifError) {
            logger.warn(
              {
                jobId,
                orderId: order.id,
                err: notifError,
              },
              "Notification creation failed",
            );
          }
        },
        {
          maxWait: 5000,
          timeout: 15000,
        },
      );

      return;
    } catch (error) {
      lastError = error as Error;

      logger.warn(
        {
          jobId,
          orderId: order.id,
          attempt,
          maxRetries,
          err: lastError,
        },
        `Transaction failed, retrying... (${attempt}/${maxRetries})`,
      );

      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000),
        );
      }
    }
  }

  throw lastError;
}

export function startCompletionCron() {
  logger.info({ interval: "60s" }, "Completion cron started");

  processCompletions();
  intervalId = setInterval(processCompletions, 60_000);
}

/**
 * Gracefully stop the completion cron job
 * Waits for running jobs to complete (max 30 seconds)
 */
export async function stopCompletionCron() {
  logger.info("Stopping completion cron...");
  isShuttingDown = true;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  // Tunggu job yang sedang running selesai (max 30 detik)
  const maxWait = 30_000;
  const checkInterval = 100;
  let waited = 0;

  while (isProcessing && waited < maxWait) {
    await new Promise((resolve) => setTimeout(resolve, checkInterval));
    waited += checkInterval;
  }

  if (isProcessing) {
    logger.warn(
      {
        waited,
        maxWait,
      },
      "Force stopping cron - job still running after 30s",
    );
  } else {
    logger.info(
      {
        waited,
      },
      "Completion cron stopped gracefully",
    );
  }
}
