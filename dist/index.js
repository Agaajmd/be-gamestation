"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./route/authRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/auth", authRoutes_1.default);
// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Game Station API is running",
        timestamp: new Date().toISOString(),
    });
});
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