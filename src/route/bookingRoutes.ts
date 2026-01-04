import { Router } from "express";
import * as BookingFlowController from "../controller/BookingFlowController";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import { calculateBookingPriceSchema } from "../validation/bodyValidation/bookingValidation";
import {
  getAvailableRoomsAndDevicesSchema,
  getAvailableDatesSchema,
} from "../validation/queryValidation/bookingQueryValidation";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

/**
 * GET /booking/branches
 * Mendapatkan semua cabang untuk halaman booking (public)
 */
router.get("/branches", BookingFlowController.getBranches);

/**
 * GET /booking/branches/:branchId/available-dates
 * Mendapatkan tanggal yang tersedia untuk booking (public)
 * Query: startDate, endDate
 */
router.get(
  "/branches/:branchId/available-dates",
  ValidateMiddleware.validateQuery(getAvailableDatesSchema),
  BookingFlowController.getAvailableDates
);

/**
 * GET /booking/branches/:branchId/available-times
 * Mendapatkan jam yang tersedia untuk booking (public)
 * Query: deviceId, bookingDate, durationMinutes
 */
router.get(
  "/branches/:branchId/available-times",
  BookingFlowController.getAvailableTimes
);

/**
 * GET /booking/branches/:branchId/duraion-options
 * Mendapatkan opsi durasi booking berdasarkan date dan jam (public)
 * Query: bookingDate, startTime
 */
router.get(
  "/branches/:branchId/duration-options",
  BookingFlowController.getDurationOptions
);

/**
 * GET /booking/branches/:branchId/categories
 * Mendapatkan kategori berdasarkan device type (public)
 * Query: deviceType, deviceVersion (optional)
 */
router.get(
  "/branches/:branchId/categories",
  BookingFlowController.getAvailableCategories
);

/**
 * GET /booking/branches/:branchId/rooms
 * Mendapatkan ruangan yang tersedia (public)
 * Query: deviceType, deviceVersion, categoryId, bookingDate, startTime
 */
router.get(
  "/branches/:branchId/rooms-and-devices",
  ValidateMiddleware.validateQuery(getAvailableRoomsAndDevicesSchema),
  BookingFlowController.getAvailableRoomsAndDevices
);

/**
 * GET /booking/cart
 * Mendapatkan data cart booking untuk user yang sudah login (authenticated)
 */
router.get("/cart", authenticateToken, BookingFlowController.getBookingCart);

/**
 * POST /booking/calculate-price
 * Menghitung harga booking sebelum checkout (public atau authenticated)
 */
router.post(
  "/calculate-price",
  ValidateMiddleware.validateBody(calculateBookingPriceSchema),
  BookingFlowController.calculateBookingPrice
);

export default router;
