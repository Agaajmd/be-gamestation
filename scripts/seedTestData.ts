// scripts/seed-test-data.ts
import { prisma } from "../src/database";

async function seedTestData() {
  try {
    const pastTime = new Date(Date.now() - 5 * 60 * 1000); 

    const order = await prisma.order.create({
      data: {
        customerId: 1n, 
        branchId: 1n, 
        status: "confirmed",
        paymentStatus: "paid",
        orderCode: `TEST-${Date.now()}`,
        totalAmount: 10000,
        orderItems: {
          create: [
            {
              roomAndDeviceId: 1n,
              bookingStart: new Date(Date.now() - 65 * 60 * 1000), 
              bookingEnd: pastTime, 
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
