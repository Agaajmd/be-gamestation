// cron/completion.cron.ts
import { prisma } from "../database";

let isProcessing = false; // Simple lock mechanism

export async function processCompletions() {
  // Cegah overlapping execution
  if (isProcessing) {
    console.log("[CRON] Previous job still running, skipping...");
    return;
  }

  isProcessing = true;
  const now = new Date();

  try {
    // 1. BATCHING: Hanya ambil 50 order per run untuk menjaga beban DB
    const orders = await prisma.order.findMany({
      take: 50,
      where: {
        status: { in: ["pending", "confirmed"] },
        orderItems: { every: { bookingEnd: { lte: now } } },
      },
      include: { orderItems: true },
    });

    if (orders.length === 0) {
      // Tidak ada log berisik jika kosong
      return;
    }

    console.log(`[CRON] Processing batch of ${orders.length} orders...`);

    // Proses loop tetap sama (logic bisnis kompleks sulit di-bulk update)
    // Tapi karena dibatasi 50, beban DB terkontrol.
    for (const order of orders) {
      try {
        // Gunakan transaction untuk menjaga data consistency
        await prisma.$transaction(async (tx) => {
          // Update order status menjadi completed
          await tx.order.update({
            where: { id: order.id },
            data: { status: "completed" },
          });

          // Stop session jika masih running
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
          }

          // Return devices ke available status
          for (const item of order.orderItems) {
            // Cek apakah ada order lain yang sedang menggunakan device
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

            // Jika tidak ada order aktif lain, ubah status device menjadi available
            if (!hasOtherActiveOrder) {
              await tx.roomAndDevice.update({
                where: { id: item.roomAndDeviceId },
                data: { status: "available" },
              });
            }
          }

          // Create notification untuk customer
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
          } catch (notifError) {
            console.warn(
              `[CRON] Notification creation failed for order ${order.id}:`,
              notifError,
            );
            // Don't fail the transaction if notification fails
          }
        });
      } catch (error) {
        console.error(`[CRON] Error processing order ${order.id}:`, error);
        // Continue processing next order jika ada error
      }
    }

    console.log(`[CRON] Batch completed.`);

    
    // OPTIONAL: Jika jumlah order == 50 (max batch), mungkin ada sisa.
    // Bisa panggil processCompletions() lagi segera (recursive)
    // atau tunggu menit berikutnya.
  } catch (error) {
    console.error("[CRON] Error processing completions:", error);
  } finally {
    isProcessing = false; // Lepas lock
  }
}

export function startCompletionCron() {
  processCompletions();
  // Tetap gunakan setInterval, tapi dilindungi variabel isProcessing
  setInterval(processCompletions, 60_000);
}
