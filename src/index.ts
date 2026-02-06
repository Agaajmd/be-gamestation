import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./route/authRoutes";
import branchRoutes from "./route/branchRoutes";
import adminRoutes from "./route/adminRoutes";
import categoryRoutes from "./route/categoriesRoutes";
import deviceRoutes from "./route/roomAndDeviceRoutes";
import gameRoutes from "./route/gameRoutes";
import orderRoutes from "./route/orderRoutes";
import paymentRoutes from "./route/paymentRoutes";
import reviewRoutes from "./route/reviewRoutes";
import notificationRoutes from "./route/notificationRoutes";
import subscriptionRoutes from "./route/subscriptionRoutes";
import bookingRoutes from "./route/bookingRoutes";
import holidayRoutes from "./route/holidayRoutes";
import gameAvailabilityRoutes from "./route/gameAvailabilityRoutes";
import advanceBookingPriceRoutes from "./route/advanceBookingPriceRoutes";
import branchPaymentMethodRoutes from "./route/branchPaymentMethodRoutes";
import userRoutes from "./route/userRoute";
import announcementRoutes from "./route/announcementRoute";
// import { testEmailConnection } from "./helper/emailHelper";
import cronRoutes from "./route/cronRoutes";
// import { startCompletionCron, stopCompletionCron } from "./cron/completionCron";
// import { prisma } from "./database"; // Import prisma instance
// import { Server } from "http"; // Import Server type

// Middleware
import { bigIntSerializer } from "./middleware/bigIntSerializer";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(bigIntSerializer);
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/branches", branchRoutes);
app.use("/branches", adminRoutes);
app.use("/branches", categoryRoutes);
app.use("/branches", deviceRoutes);
app.use("/branches", gameAvailabilityRoutes);
app.use("/games", gameRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/reviews", reviewRoutes);
app.use("/notifications", notificationRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/booking", bookingRoutes);
app.use("/holidays", holidayRoutes);
app.use("/advance-booking-price", advanceBookingPriceRoutes);
app.use("/branch-payment-methods", branchPaymentMethodRoutes);
app.use("/announcements", announcementRoutes);

app.use("/api/cron", cronRoutes);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Game Station API is running",
    timestamp: new Date().toISOString(),
  });
});

// testEmailConnection().catch(console.error);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);

  // Start cron jobs
  // console.log("⏰ Starting cron jobs...");
  // startCompletionCron();
});

// ========================================
// 🛡️ GRACEFUL SHUTDOWN HANDLERS
// ========================================

// async function gracefulShutdown(signal: string) {
//   console.log(`\n📛 ${signal} received - Starting graceful shutdown...`);

//   // 1. Stop accepting new requests
//   server.close(() => {
//     console.log("✅ HTTP server closed - No new requests accepted");
//   });

//   try {
//     // 2. Stop cron jobs
//     console.log("🛑 Stopping cron jobs...");
//     // await stopCompletionCron();
//     console.log("✅ Cron jobs stopped");

//     // 3. Close database connections
//     console.log("🔌 Disconnecting database...");
//     await prisma.$disconnect();
//     console.log("✅ Database disconnected");

//     console.log("👋 Graceful shutdown completed successfully");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Error during graceful shutdown:", error);
//     process.exit(1);
//   }
// }

// // Handle different termination signals
// process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
// process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// // Handle uncaught errors
// process.on("uncaughtException", (error) => {
//   console.error("💥 Uncaught Exception:", error);
//   gracefulShutdown("UNCAUGHT_EXCEPTION");
// });

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
//   gracefulShutdown("UNHANDLED_REJECTION");
// });

export default app;
