"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBookingPrice = exports.getBookingCart = exports.getAvailableRoomsAndDevices = exports.getAvailableCategories = exports.getDurationOptions = exports.getAvailableTimes = exports.getAvailableDates = exports.getBranches = void 0;
// import { prisma } from "../database";
// Service
const bookingService_1 = require("../service/BookingService/bookingService");
const orderService_1 = require("../service/OrderService/orderService");
// Error
const responseHelper_1 = require("../helper/responseHelper");
/**
 * GET /booking/branches
 * Mendapatkan semua cabang untuk halaman booking
 * Jika user sudah punya cart order, hanya return branch yang sama
 */
const getBranches = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const branches = await (0, bookingService_1.getBranchesService)(userId);
        res.status(200).json({
            success: true,
            data: branches,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getBranches = getBranches;
/**
 * GET /booking/branches/:branchId/available-dates
 * Mendapatkan tanggal yang tersedia untuk booking
 */
const getAvailableDates = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const { month } = req.query;
        // Parse month
        const [year, monthNum] = month.split("-").map(Number);
        const startDate = new Date(Date.UTC(year, monthNum - 1, 1, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
        const { availableDates, fullyBookedDates, closedDates, openHour, closeHour, totalDevices, } = await (0, bookingService_1.getAvailableDatesService)(branchId, startDate, endDate);
        res.status(200).json({
            success: true,
            data: {
                availableDates,
                fullyBookedDates,
                closedDates,
            },
            meta: {
                month,
                totalDevices,
                branchOpenHour: openHour,
                branchCloseHour: closeHour,
            },
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getAvailableDates = getAvailableDates;
/**
 * GET /booking/branches/:branchId/available-times
 * Mendapatkan jam yang tersedia untuk booking di tanggal tertentu
 */
const getAvailableTimes = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const { bookingDate } = req.query;
        const date = new Date(bookingDate);
        const slots = await (0, bookingService_1.getAvailableTimesService)(branchId, date);
        res.status(200).json({
            success: true,
            data: slots.timeSlots,
            meta: {
                totalDevices: slots.totalDevices,
                note: "availableDeviceCount menunjukkan jumlah device yang bebas di waktu ini. Validasi durasi dilakukan di step berikutnya.",
            },
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getAvailableTimes = getAvailableTimes;
/**
 * GET /booking/branches/:branchId/duration-options
 * Mendapatkan opsi durasi booking berdasarkan tanggal dan jam mulai
 */
const getDurationOptions = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const { bookingDate, startTime } = req.query;
        // Parse start time
        const [startHour, startMinute] = startTime
            .split(":")
            .map(Number);
        const { durationOptions, closeTime, maxDurationMinutes } = await (0, bookingService_1.getDurationOptionsService)(branchId, bookingDate, startHour, startMinute);
        res.status(200).json({
            success: true,
            data: durationOptions,
            meta: {
                startTime: startTime,
                closeTime: closeTime,
                maxDurationMinutes: maxDurationMinutes,
                note: "Durasi minimum 1 jam, step 60 menit",
            },
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getDurationOptions = getDurationOptions;
/**
 * GET /booking/branches/:branchId/categories
 * Mendapatkan kategori berdasarkan device type dan version
 */
const getAvailableCategories = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const categoriesWithAvailability = await (0, bookingService_1.getAvailableCategoriesService)(branchId);
        const result = categoriesWithAvailability.map((category) => {
            const uniqueDeviceTypes = Array.from(new Map(category.roomAndDevices.map((d) => [
                `${d.deviceType}-${d.version}`,
                { deviceType: d.deviceType, version: d.version },
            ])).values());
            return {
                id: category.id,
                name: category.name,
                description: category.description,
                pricePerHour: category.pricePerHour,
                amenities: category.amenities,
                deviceTypes: uniqueDeviceTypes, // Distinct, tanpa ID
                availableDeviceCount: category.roomAndDevices.length, // Total count (karena setiap row punya id unik)
                isAvailable: category.roomAndDevices.length > 0,
            };
        });
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil kategori",
        });
    }
};
exports.getAvailableCategories = getAvailableCategories;
/**
 * GET /booking/branches/:branchId/rooms-and-devices
 * Mendapatkan room dan device yang tersedia berdasarkan filter
 */
const getAvailableRoomsAndDevices = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const { categoryId, bookingDate, startTime, durationMinutes } = req.query;
        const categoryIdBigInt = BigInt(categoryId);
        const duration = parseInt(durationMinutes);
        // Parse waktu yang dipilih user
        const [hours, minutes] = startTime.split(":").map(Number);
        const availableRoomsAndDevices = await (0, bookingService_1.getAvailableRoomAndDeviceService)(branchId, categoryIdBigInt, bookingDate, hours, minutes, duration);
        res.status(200).json({
            success: true,
            data: availableRoomsAndDevices,
            meta: {
                bookingDate: bookingDate,
                startTime: startTime,
                durationMinutes: duration,
                availableCount: availableRoomsAndDevices.length,
            },
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getAvailableRoomsAndDevices = getAvailableRoomsAndDevices;
/**
 * GET /booking/cart
 * Mengambil data cart booking yang sudah diorder tapi belum checkout
 */
const getBookingCart = async (req, res) => {
    try {
        const userId = BigInt(req.user.userId);
        const { order, totalItems, totalAmount, paymentMethods } = await (0, bookingService_1.getBookingCartService)(userId);
        res.status(200).json({
            success: true,
            data: {
                totalItems,
                totalAmount,
                order,
                paymentMethods,
            },
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getBookingCart = getBookingCart;
/**
 * POST /booking/calculate-price
 * Menghitung harga booking sebelum checkout
 */
const calculateBookingPrice = async (req, res) => {
    try {
        const { branchId, deviceId, categoryId, bookingDate, durationMinutes } = req.body;
        const branchIdBigInt = BigInt(branchId);
        const deviceIdBigInt = BigInt(deviceId);
        const categoryIdBigInt = BigInt(categoryId);
        const result = await (0, orderService_1.calculateBookingPriceService)(branchIdBigInt, deviceIdBigInt, categoryIdBigInt, bookingDate, durationMinutes);
        res.status(200).json({
            success: true,
            data: {
                baseAmount: result.baseAmount.toFixed(2),
                categoryFee: result.categoryFee.toFixed(2),
                advanceBookingFee: result.advanceBookingFee.toFixed(2),
                totalAmount: result.totalAmount.toFixed(2),
            },
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.calculateBookingPrice = calculateBookingPrice;
//# sourceMappingURL=BookingFlowController.js.map