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
const sessionRoutes_1 = __importDefault(require("./route/sessionRoutes"));
const reviewRoutes_1 = __importDefault(require("./route/reviewRoutes"));
const notificationRoutes_1 = __importDefault(require("./route/notificationRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./route/subscriptionRoutes"));
const bookingRoutes_1 = __importDefault(require("./route/bookingRoutes"));
const emailHelper_1 = require("./helper/emailHelper");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/auth", authRoutes_1.default);
app.use("/branches", branchRoutes_1.default);
app.use("/branches", adminRoutes_1.default);
app.use("/branches", categoriesRoutes_1.default);
app.use("/branches", roomAndDeviceRoutes_1.default);
app.use("/games", gameRoutes_1.default);
app.use("/orders", orderRoutes_1.default);
app.use("/payments", paymentRoutes_1.default);
app.use("/sessions", sessionRoutes_1.default);
app.use("/reviews", reviewRoutes_1.default);
app.use("/notifications", notificationRoutes_1.default);
app.use("/subscriptions", subscriptionRoutes_1.default);
app.use("/booking", bookingRoutes_1.default);
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
});
exports.default = app;
//# sourceMappingURL=index.js.map