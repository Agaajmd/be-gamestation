"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
// Route imports
const authRoutes_1 = __importDefault(require("./route/authRoutes"));
const branchRoutes_1 = __importDefault(require("./route/branchRoutes"));
const adminRoutes_1 = __importDefault(require("./route/adminRoutes"));
const categoriesRoutes_1 = __importDefault(require("./route/categoriesRoutes"));
const roomAndDeviceRoutes_1 = __importDefault(require("./route/roomAndDeviceRoutes"));
const gameRoutes_1 = __importDefault(require("./route/gameRoutes"));
const orderRoutes_1 = __importDefault(require("./route/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./route/paymentRoutes"));
const reviewRoutes_1 = __importDefault(require("./route/reviewRoutes"));
const notificationRoutes_1 = __importDefault(require("./route/notificationRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./route/subscriptionRoutes"));
const bookingRoutes_1 = __importDefault(require("./route/bookingRoutes"));
const holidayRoutes_1 = __importDefault(require("./route/holidayRoutes"));
const gameAvailabilityRoutes_1 = __importDefault(require("./route/gameAvailabilityRoutes"));
const advanceBookingPriceRoutes_1 = __importDefault(require("./route/advanceBookingPriceRoutes"));
const branchPaymentMethodRoutes_1 = __importDefault(require("./route/branchPaymentMethodRoutes"));
const userRoute_1 = __importDefault(require("./route/userRoute"));
const announcementRoute_1 = __importDefault(require("./route/announcementRoute"));
const cronRoutes_1 = __importDefault(require("./route/cronRoutes"));
// Security & Validation middleware
const bigIntSerializer_1 = require("./middleware/bigIntSerializer");
const securityHeaders_1 = require("./middleware/securityHeaders");
const rateLimiter_1 = require("./middleware/rateLimiter");
const envValidator_1 = require("./config/envValidator");
const apiKeyManager_1 = require("./helper/apiKeyManager");
const inputSanitizer_1 = require("./helper/inputSanitizer");
const securityConfig_1 = require("./config/securityConfig");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
// ========================================
// 🛡️ SECURITY & VALIDATION SETUP
// ========================================
// 1. Validate environment variables on startup
console.log("🔍 Validating environment variables...");
(0, envValidator_1.validateEnvironment)();
// 2. Initialize API keys for internal services
(0, apiKeyManager_1.initializeDefaultAPIKeys)();
// ========================================
// 🔧 MIDDLEWARE SETUP
// ========================================
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // pakai CSP custom
}));
// Security headers
app.use(securityHeaders_1.securityHeadersMiddleware);
app.use(securityHeaders_1.hidePoweredByMiddleware);
// Body parsing with size limits
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// CORS with security configuration
app.use((0, cors_1.default)((0, securityHeaders_1.getCorsOptions)()));
// Custom big int serializer
app.use(bigIntSerializer_1.bigIntSerializer);
// Query parameter sanitization (Express 5 compatible)
app.use((req, _res, next) => {
    try {
        const sanitized = (0, inputSanitizer_1.sanitizeQueryParams)(req.query);
        Object.keys(req.query).forEach((key) => {
            delete req.query[key];
        });
        Object.assign(req.query, sanitized);
    }
    catch (error) {
        console.error("Query sanitization error:", error);
    }
    next();
});
// General API rate limiting (applies to all routes except those with custom limiters)
if (securityConfig_1.securityConfig.features.enableRateLimiting) {
    app.use(rateLimiter_1.apiRateLimiter);
}
// Static file serving for uploads
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
// ========================================
// 📍 PUBLIC ROUTES (Health Check)
// ========================================
// Health check endpoint (no auth required)
app.get("/health", (_req, res) => {
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
app.use("/auth", securityConfig_1.securityConfig.features.enableRateLimiting ? rateLimiter_1.authRateLimiter : [], authRoutes_1.default);
// ========================================
// 🔒 PROTECTED ROUTES
// ========================================
app.use("/users", userRoute_1.default);
app.use("/branches", branchRoutes_1.default);
app.use("/branches", adminRoutes_1.default);
app.use("/branches", categoriesRoutes_1.default);
app.use("/branches", roomAndDeviceRoutes_1.default);
app.use("/branches", gameAvailabilityRoutes_1.default);
app.use("/games", gameRoutes_1.default);
app.use("/orders", orderRoutes_1.default);
app.use("/payments", paymentRoutes_1.default);
app.use("/reviews", reviewRoutes_1.default);
app.use("/notifications", notificationRoutes_1.default);
app.use("/subscriptions", subscriptionRoutes_1.default);
app.use("/booking", bookingRoutes_1.default);
app.use("/holidays", holidayRoutes_1.default);
app.use("/advance-booking-price", advanceBookingPriceRoutes_1.default);
app.use("/branch-payment-methods", branchPaymentMethodRoutes_1.default);
app.use("/announcements", announcementRoute_1.default);
// ========================================
// ⚙️ INTERNAL CRON ROUTES (API key auth required)
// ========================================
app.use("/api/cron", cronRoutes_1.default);
// ========================================
// ❌ ERROR HANDLING
// ========================================
// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
// Global error handler
app.use((error, _req, res, _next) => {
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
async function gracefulShutdown(signal) {
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
    }
    catch (error) {
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
exports.default = app;
//# sourceMappingURL=index.js.map