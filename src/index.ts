import "dotenv/config";
import express, { Application, Request, Response } from "express";
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
import { testEmailConnection } from "./helper/emailHelper";

// Middleware
import { bigIntSerializer } from "./middleware/bigIntSerializer";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(bigIntSerializer);
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
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

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Game Station API is running",
    timestamp: new Date().toISOString(),
  });
});

testEmailConnection().catch(console.error);

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
});

export default app;
