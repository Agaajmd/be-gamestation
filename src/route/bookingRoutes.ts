import { Router } from "express";
import * as BookingFlowController from "../controller/BookingFlowController";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import { calculateBookingPriceSchema } from "../validation/bodyValidation/bookingValidation";
import { getAvailableRoomsAndDevicesSchema } from "../validation/queryValidation/bookingQueryValidation";

const router = Router();

/**
 * GET /booking/branches
 * Mendapatkan semua cabang untuk halaman booking (public)
 */
router.get("/branches", BookingFlowController.getBranches);

/**
 * GET /booking/branches/:branchId/device-types
 * Mendapatkan tipe device yang tersedia di cabang (public)
 */
router.get(
  "/branches/:branchId/device-types",
  BookingFlowController.getAvailableDeviceTypes
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
 * GET /booking/branches/:branchId/available-dates
 * Mendapatkan tanggal yang tersedia untuk booking (public)
 * Query: startDate, endDate
 */
router.get(
  "/branches/:branchId/available-dates",
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
 * POST /booking/calculate-price
 * Menghitung harga booking sebelum checkout (public atau authenticated)
 */
router.post(
  "/calculate-price",
  ValidateMiddleware.validateBody(calculateBookingPriceSchema),
  BookingFlowController.calculateBookingPrice
);

export default router;
