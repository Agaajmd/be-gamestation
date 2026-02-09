import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";

// Route imports
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
import cronRoutes from "./route/cronRoutes";

// Security & Validation middleware
import { bigIntSerializer } from "./middleware/bigIntSerializer";
import {
  securityHeadersMiddleware,
  hidePoweredByMiddleware,
  getCorsOptions,
} from "./middleware/securityHeaders";
import { apiRateLimiter, authRateLimiter } from "./middleware/rateLimiter";
import { validateEnvironment } from "./config/envValidator";
import { initializeDefaultAPIKeys } from "./helper/apiKeyManager";
import { sanitizeQueryParams } from "./helper/inputSanitizer";

const app: Application = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ========================================
// 🛡️ SECURITY & VALIDATION SETUP
// ========================================

// 1. Validate environment variables on startup
console.log("🔍 Validating environment variables...");
validateEnvironment();

// 2. Initialize API keys for internal services
initializeDefaultAPIKeys();

// ========================================
// 🔧 MIDDLEWARE SETUP
// ========================================

app.use(
  helmet({
    contentSecurityPolicy: false, // pakai CSP custom
  })
);

// Security headers
app.use(securityHeadersMiddleware);
app.use(hidePoweredByMiddleware);

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS with security configuration
app.use(cors(getCorsOptions()));

// Custom big int serializer
app.use(bigIntSerializer);

// Query parameter sanitization (Express 5 compatible)
app.use((req: Request, _res: Response, next: any) => {
  try {
    const sanitized = sanitizeQueryParams(req.query as Record<string, any>);

    Object.keys(req.query).forEach((key) => {
      delete req.query[key];
    });

    Object.assign(req.query, sanitized);
  } catch (error) {
    console.error("Query sanitization error:", error);
  }
  next();
});

// General API rate limiting (applies to all routes except those with custom limiters)
app.use(apiRateLimiter);

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ========================================
// 📍 PUBLIC ROUTES (Health Check)
// ========================================

// Health check endpoint (no auth required)
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Game Station API is running",
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// 🔐 AUTH ROUTES (with strict rate limiting)
// ========================================

// Auth routes
app.use("/auth", authRateLimiter, authRoutes);

// ========================================
// 🔒 PROTECTED ROUTES
// ========================================

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

// ========================================
// ⚙️ INTERNAL CRON ROUTES (API key auth required)
// ========================================

app.use("/api/cron", cronRoutes);

// ========================================
// ❌ ERROR HANDLING
// ========================================

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((error: any, _req: Request, res: Response, _next: any) => {
  console.error("❌ Unexpected error:", error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV === "development" && { stack: error.stack }),
  });
});

// ========================================
// 🚀 SERVER STARTUP
// ========================================

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  🎮 Game Station API Server                      ║
║  🚀 Running on port ${PORT}                       ║
║  🌍 Environment: ${NODE_ENV.toUpperCase().padEnd(21)} ║
║  🔐 Security: ENABLED                            ║
║  📊 Health Check: http://localhost:${PORT}/health  ║
╚════════════════════════════════════════════════╝
  `);
});

// ========================================
// 🛡️ GRACEFUL SHUTDOWN HANDLERS
// ========================================

async function gracefulShutdown(signal: string) {
  console.log(`\n📛 ${signal} received - Starting graceful shutdown...`);

  // 1. Stop accepting new requests
  server.close(() => {
    console.log("✅ HTTP server closed - No new requests accepted");
  });

  try {
    // 2. Stop cron jobs (uncomment when needed)
    // console.log("🛑 Stopping cron jobs...");
    // await stopCompletionCron();
    // console.log("✅ Cron jobs stopped");

    // 3. Close database connections (uncomment when needed)
    // console.log("🔌 Disconnecting database...");
    // await prisma.$disconnect();
    // console.log("✅ Database disconnected");

    console.log("👋 Graceful shutdown completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }
}

// Handle different termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});

export default app;
