"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBranchesService = getBranchesService;
exports.getAvailableDatesService = getAvailableDatesService;
exports.getAvailableTimesService = getAvailableTimesService;
exports.getDurationOptionsService = getDurationOptionsService;
exports.getAvailableCategoriesService = getAvailableCategoriesService;
exports.getAvailableRoomAndDeviceService = getAvailableRoomAndDeviceService;
exports.getBookingCartService = getBookingCartService;
exports.validateBranchForOrderService = validateBranchForOrderService;
// Repository
const branchRepository_1 = require("../../repository/branchRepository");
const roomAndDeviceRepository_1 = require("../../repository/roomAndDeviceRepository");
const holidayRepository_1 = require("../../repository/holidayRepository");
const categoryRepository_1 = require("../../repository/categoryRepository");
const branchPaymentMethodRepository_1 = require("../../repository/branchPaymentMethodRepository");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Queries
const roomAndDeviceQuery_1 = require("../../queries/roomAndDeviceQuery");
const bookingCartQuery_1 = require("../../queries/bookingCartQuery");
// Error
const branchError_1 = require("../../errors/BranchError/branchError");
const roomAndDeviceError_1 = require("../../errors/RoomAndDeviceError/roomAndDeviceError");
const holidayError_1 = require("../../errors/HolidayError/holidayError");
// Helpers
const fetchMonthlyData_1 = require("../../helper/bookingAvailability/fetchMonthlyData");
const getBranchOperatingHours_1 = require("../../helper/bookingAvailability/getBranchOperatingHours");
const categorizeDates_1 = require("../../helper/categorizeDates");
const generateTimes_1 = require("../../helper/generateTimes");
const calculateMaximumDuration_1 = require("../../helper/calculateMaximumDuration");
const generateDurationOptions_1 = require("../../helper/generateDurationOptions");
const checkDeviceAvailability_1 = require("../../helper/checkDeviceAvailability");
// Service to get all branches
// Jika user sudah punya cart order, hanya return branch yang sama dengan cart
async function getBranchesService(userId) {
    const branches = await branchRepository_1.BranchRepository.findAvailableBranches();
    // Check apakah user sudah punya cart order
    const cartOrder = await bookingCartQuery_1.BookingCartQuery.findBookingCartByUserId(userId);
    // Jika ada cart order, filter branches untuk hanya return branch yang sama
    if (cartOrder) {
        return branches.filter((branch) => branch.id === cartOrder.branchId);
    }
    return branches;
}
// Service to get available dates for a branch
async function getAvailableDatesService(branchId, startDate, endDate) {
    const [branch, availableRoomsAndDevices] = await Promise.all([
        branchRepository_1.BranchRepository.findOpenAndCloseTimeById(branchId),
        roomAndDeviceRepository_1.RoomAndDeviceRepository.findAvailableByBranchId(branchId),
    ]);
    if (!branch) {
        throw new branchError_1.BranchNotFoundError();
    }
    if (availableRoomsAndDevices.length === 0) {
        throw new roomAndDeviceError_1.RoomAndDeviceUnavailableError();
    }
    const roomAndDeviceIds = availableRoomsAndDevices.map((item) => item.id);
    const [orders, exceptions, holidays] = await (0, fetchMonthlyData_1.fetchMonthlyData)(branchId, roomAndDeviceIds, startDate, endDate);
    const { openHour, closeHour, totalHours } = (0, getBranchOperatingHours_1.getBranchOperatingHours)(branch.openTime, branch.closeTime);
    const { availableDates, fullyBookedDates, closedDates } = (0, categorizeDates_1.categorizeDates)(startDate, endDate, availableRoomsAndDevices, orders, openHour, closeHour, totalHours, exceptions, holidays.map((h) => h.date));
    return {
        availableDates,
        fullyBookedDates,
        closedDates,
        openHour,
        closeHour,
        totalDevices: availableRoomsAndDevices.length,
    };
}
// Service to get available times for a specific date
async function getAvailableTimesService(branchId, date) {
    const branch = await branchRepository_1.BranchRepository.findById(branchId);
    if (!branch) {
        throw new branchError_1.BranchNotFoundError();
    }
    const isDateHoliday = await holidayRepository_1.HolidayRepository.isDateHoliday(branchId, date);
    if (isDateHoliday) {
        throw new holidayError_1.HolidayError();
    }
    const { openHour, closeHour } = (0, getBranchOperatingHours_1.getBranchOperatingHours)(branch.openTime, branch.closeTime);
    const roomsAndDevices = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findByBranchIdWithOrdersAndExceptions(branchId, date, openHour, closeHour);
    if (roomsAndDevices.length === 0) {
        throw new roomAndDeviceError_1.RoomAndDeviceUnavailableError();
    }
    const timeSlots = (0, generateTimes_1.generateTimeSlots)(date.toISOString(), {
        openTime: branch.openTime?.toISOString(),
        closeTime: branch.closeTime?.toISOString(),
    }, roomsAndDevices);
    return { timeSlots, totalDevices: roomsAndDevices.length };
}
// Service to get duration options
async function getDurationOptionsService(branchId, bookingDate, startHour, startMinute) {
    // Sanitize numeric inputs
    const hour = (0, inputSanitizer_1.sanitizeNumber)(startHour, 0, 23) ?? 0;
    const minute = (0, inputSanitizer_1.sanitizeNumber)(startMinute, 0, 59) ?? 0;
    const date = (0, inputSanitizer_1.sanitizeString)(bookingDate);
    const branch = await branchRepository_1.BranchRepository.findById(branchId);
    if (!branch) {
        throw new branchError_1.BranchNotFoundError();
    }
    const maxDurationMinutes = (0, calculateMaximumDuration_1.calculateMaximumDuration)(date, hour, minute, branch.closeTime);
    const durationOptions = (0, generateDurationOptions_1.generateDurationOptions)(maxDurationMinutes);
    return { durationOptions, closeTime: branch.closeTime, maxDurationMinutes };
}
// Service to get available categories for a branch
async function getAvailableCategoriesService(branchId) {
    const availableRoomsAndDevices = await roomAndDeviceRepository_1.RoomAndDeviceRepository.findAvailableByBranchId(branchId);
    if (availableRoomsAndDevices.length === 0) {
        throw new roomAndDeviceError_1.RoomAndDeviceUnavailableError();
    }
    const categories = await categoryRepository_1.CategoryRepository.findAllByBranchIdWithRoomAndDevice(branchId);
    return categories;
}
// Service to get available room and device based on category, booking date, start time, and duration
async function getAvailableRoomAndDeviceService(branchId, categoryId, bookingDate, startHour, startMinute, durationMinutes) {
    // Sanitize inputs
    const date = (0, inputSanitizer_1.sanitizeString)(bookingDate);
    const hour = (0, inputSanitizer_1.sanitizeNumber)(startHour, 0, 23) ?? 0;
    const minute = (0, inputSanitizer_1.sanitizeNumber)(startMinute, 0, 59) ?? 0;
    const duration = (0, inputSanitizer_1.sanitizeNumber)(durationMinutes, 0) ?? 0;
    const targetStart = new Date(date);
    targetStart.setUTCHours(hour, minute, 0, 0);
    const targetEnd = new Date(targetStart);
    targetEnd.setMinutes(targetEnd.getMinutes() + duration);
    const roomsAndDevices = await roomAndDeviceQuery_1.RoomAndDeviceQuery.findAvailableRoomAndDevicesByBranchAndCategory(branchId, categoryId);
    const availableRoomsAndDevices = roomsAndDevices
        .map((roomAndDevice) => {
        const availability = (0, checkDeviceAvailability_1.checkDeviceAvailability)(roomAndDevice, targetStart, targetEnd);
        return {
            roomAndDevice,
            ...availability,
        };
    })
        .filter((item) => item.isAvailable)
        .map((item) => ({
        id: item.roomAndDevice.id.toString(),
        roomNumber: item.roomAndDevice.roomNumber,
        name: item.roomAndDevice.name,
        type: item.roomAndDevice.deviceType,
        version: item.roomAndDevice.version,
        pricePerHour: item.roomAndDevice.pricePerHour.toString(),
        categoryName: item.roomAndDevice.category?.name,
        categoryTier: item.roomAndDevice.category?.tier,
    }));
    if (availableRoomsAndDevices.length === 0) {
        throw new roomAndDeviceError_1.RoomAndDeviceUnavailableError();
    }
    return availableRoomsAndDevices;
}
// Service to get booking cart
async function getBookingCartService(userId) {
    const cartOrder = await bookingCartQuery_1.BookingCartQuery.findBookingCartByUserId(userId);
    const totalItems = cartOrder ? cartOrder.orderItems.length : 0;
    const totalAmount = cartOrder ? Number(cartOrder.totalAmount) : 0;
    const paymentMethods = cartOrder
        ? await branchPaymentMethodRepository_1.BranchPaymentMethodRepository.findActiveByBranchId(cartOrder.branchId)
        : [];
    return {
        order: cartOrder,
        totalItems,
        totalAmount,
        paymentMethods,
    };
}
// Service to validate if user can order from a specific branch
// Jika sudah ada cart order dan branch berbeda, throw error
async function validateBranchForOrderService(userId, requestedBranchId) {
    const cartOrder = await bookingCartQuery_1.BookingCartQuery.findBookingCartByUserId(userId);
    if (cartOrder && cartOrder.branchId !== requestedBranchId) {
        throw new Error(`Anda sudah memiliki order di branch ID ${cartOrder.branchId}. Tidak bisa menambah order dari branch berbeda. Mohon selesaikan atau batalkan pesanan sebelumnya.`);
    }
    return true;
}
//# sourceMappingURL=bookingService.js.map