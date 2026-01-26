// scripts/seed-test-data.ts
import { prisma } from "../src/database";

async function seedTestData() {
  try {
    const pastTime = new Date(Date.now() - 5 * 60 * 1000); // 5 menit yang lalu

    const order = await prisma.order.create({
      data: {
        customerId: 1n, // pastikan customer ini ada
        branchId: 1n, // pastikan branch ini ada
        status: "confirmed",
        paymentStatus: "paid",
        orderCode: `TEST-${Date.now()}`,
        totalAmount: 10000,
        orderItems: {
          create: [
            {
              roomAndDeviceId: 1n, // pastikan device ini ada
              bookingStart: new Date(Date.now() - 65 * 60 * 1000), // 65 menit lalu
              bookingEnd: pastTime, // sudah lewat 5 menit
              durationMinutes: 60,
              price: 10000,
              baseAmount: 10000,
              categoryFee: 0,
              advanceBookingFee: 0,
            },
          ],
        },
      },
      include: {
        orderItems: true,
      },
    });

    console.log("✅ Test data created successfully:");
    console.log(`   Order ID: ${order.id}`);
    console.log(`   Order Code: ${order.orderCode}`);
    console.log(`   Booking End: ${pastTime.toISOString()}`);
    console.log(`   Current Time: ${new Date().toISOString()}`);
    console.log("\n🚀 Now you can trigger the cron job to test completion!");
  } catch (error) {
    console.error("❌ Error creating test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
