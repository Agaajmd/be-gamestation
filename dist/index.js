"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
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
const emailHelper_1 = require("./helper/emailHelper");
const cronRoutes_1 = __importDefault(require("./route/cronRoutes"));
const completionCron_1 = require("./cron/completionCron");
// Middleware
const bigIntSerializer_1 = require("./middleware/bigIntSerializer");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(bigIntSerializer_1.bigIntSerializer);
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/auth", authRoutes_1.default);
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
app.use("/api/cron", cronRoutes_1.default);
// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Game Station API is running",
        timestamp: new Date().toISOString(),
    });
});
(0, emailHelper_1.testEmailConnection)().catch(console.error);
// 404 handler
app.use((_req, res) => {
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
    console.log("⏰ Starting cron jobs...");
    (0, completionCron_1.startCompletionCron)();
});
exports.default = app;
//# sourceMappingURL=index.js.map