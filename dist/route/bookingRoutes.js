"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BookingFlowController = __importStar(require("../controller/BookingFlowController"));
const ValidateMiddleware = __importStar(require("../middleware/validateMiddleware"));
const bookingValidation_1 = require("../validation/bodyValidation/bookingValidation");
const bookingQueryValidation_1 = require("../validation/queryValidation/bookingQueryValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * GET /booking/branches
 * Mendapatkan semua cabang untuk halaman booking (public)
 */
router.get("/branches", authMiddleware_1.authenticateToken, BookingFlowController.getBranches);
/**
 * GET /booking/branches/:branchId/available-dates
 * Mendapatkan tanggal yang tersedia untuk booking (public)
 * Query: startDate, endDate
 */
router.get("/branches/:branchId/available-dates", ValidateMiddleware.validateQuery(bookingQueryValidation_1.getAvailableDatesSchema), BookingFlowController.getAvailableDates);
/**
 * GET /booking/branches/:branchId/available-times
 * Mendapatkan jam yang tersedia untuk booking (public)
 * Query: deviceId, bookingDate, durationMinutes
 */
router.get("/branches/:branchId/available-times", BookingFlowController.getAvailableTimes);
/**
 * GET /booking/branches/:branchId/duraion-options
 * Mendapatkan opsi durasi booking berdasarkan date dan jam (public)
 * Query: bookingDate, startTime
 */
router.get("/branches/:branchId/duration-options", BookingFlowController.getDurationOptions);
/**
 * GET /booking/branches/:branchId/categories
 * Mendapatkan kategori berdasarkan device type (public)
 * Query: deviceType, deviceVersion (optional)
 */
router.get("/branches/:branchId/categories", BookingFlowController.getAvailableCategories);
/**
 * GET /booking/branches/:branchId/rooms
 * Mendapatkan ruangan yang tersedia (public)
 * Query: deviceType, deviceVersion, categoryId, bookingDate, startTime
 */
router.get("/branches/:branchId/rooms-and-devices", ValidateMiddleware.validateQuery(bookingQueryValidation_1.getAvailableRoomsAndDevicesSchema), BookingFlowController.getAvailableRoomsAndDevices);
/**
 * GET /booking/cart
 * Mendapatkan data cart booking untuk user yang sudah login (authenticated)
 */
router.get("/cart", authMiddleware_1.authenticateToken, BookingFlowController.getBookingCart);
/**
 * POST /booking/calculate-price
 * Menghitung harga booking sebelum checkout (public atau authenticated)
 */
router.post("/calculate-price", ValidateMiddleware.validateBody(bookingValidation_1.calculateBookingPriceSchema), BookingFlowController.calculateBookingPrice);
exports.default = router;
//# sourceMappingURL=bookingRoutes.js.map