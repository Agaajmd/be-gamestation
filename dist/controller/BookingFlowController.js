"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBookingPrice = exports.getAvailableRoomsAndDevices = exports.getAvailableCategories = exports.getAvailableTimes = exports.getAvailableDates = exports.getBranches = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const fetchMonthlyData_1 = require("../helper/bookingAvailability/fetchMonthlyData");
const getBranchOperatingHours_1 = require("../helper/bookingAvailability/getBranchOperatingHours");
const isPastDate_1 = require("../helper/bookingAvailability/isPastDate");
const isDateClosed_1 = require("../helper/bookingAvailability/isDateClosed");
const calculateDateAvailability_1 = require("../helper/bookingAvailability/calculateDateAvailability");
/**
 * GET /booking/branches
 * Mendapatkan semua cabang untuk halaman booking
 */
const getBranches = async (_req, res) => {
    try {
        const branches = await prisma_1.default.branch.findMany({
            select: {
                id: true,
                name: true,
                address: true,
                phone: true,
                openTime: true,
                closeTime: true,
                amenities: true,
                _count: {
                    select: {
                        roomAndDevices: {
                            where: {
                                status: "available",
                            },
                        },
                    },
                },
            },
            orderBy: { name: "asc" },
        });
        const serialized = JSON.parse(JSON.stringify(branches, (_key, value) => typeof value === "bigint" ? value.toString() : value));
        res.status(200).json({
            success: true,
            data: serialized,
        });
    }
    catch (error) {
        console.error("Get branches error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data cabang",
        });
    }
};
exports.getBranches = getBranches;
/**
 * GET /booking/branches/:branchId/available-dates
 * Mendapatkan tanggal yang tersedia untuk booking
 */
const getAvailableDates = async (req, res) => {
    try {
        const { branchId, month } = req.query;
        const branchIdBigInt = BigInt(branchId);
        // Parse month
        const [year, monthNum] = month.split("-").map(Number);
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0);
        // Get branch with operating hours
        const branch = await prisma_1.default.branch.findUnique({
            where: { id: branchIdBigInt },
            select: {
                id: true,
                openTime: true,
                closeTime: true,
            },
        });
        if (!branch) {
            res.status(404).json({
                success: false,
                message: "Cabang tidak ditemukan",
            });
            return;
        }
        // Get all available devices
        const devices = await prisma_1.default.roomAndDevice.findMany({
            where: {
                branchId: branchIdBigInt,
                status: { not: "maintenance" },
            },
            select: { id: true },
        });
        if (devices.length === 0) {
            res.status(200).json({
                success: true,
                data: {
                    availableDates: [],
                    fullyBookedDates: [],
                    closedDates: [],
                },
                message: "Tidak ada device tersedia di branch ini",
            });
            return;
        }
        // Fetch all orders and exceptions for the month
        const deviceIds = devices.map((d) => d.id);
        const [orders, exceptions] = await (0, fetchMonthlyData_1.fetchMonthlyData)(branchIdBigInt, deviceIds, startDate, endDate);
        // Get operating hours
        const { openHour, closeHour, totalHours } = (0, getBranchOperatingHours_1.getBranchOperatingHours)(branch.openTime, branch.closeTime);
        // Categorize dates
        const availableDates = [];
        const fullyBookedDates = [];
        const closedDates = [];
        // Loop through each date in the month
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const currentDate = new Date(d);
            console.log("currentDate", currentDate);
            const dateStr = currentDate.toISOString().split("T")[0];
            console.log(dateStr);
            // Skip past dates
            if ((0, isPastDate_1.isPastDate)(currentDate))
                continue;
            // Check if branch is closed
            if ((0, isDateClosed_1.isDateClosed)(currentDate, openHour, closeHour, exceptions, devices.length)) {
                closedDates.push(dateStr);
                continue;
            }
            // Calculate availability
            const { availableDevices, bookedDevices } = (0, calculateDateAvailability_1.calculateDateAvailability)(currentDate, devices, orders, exceptions, totalHours, openHour, closeHour);
            // Categorize
            if (availableDevices === 0 && bookedDevices > 0) {
                fullyBookedDates.push(dateStr);
            }
            else if (availableDevices > 0) {
                availableDates.push(dateStr);
            }
        }
        res.status(200).json({
            success: true,
            data: {
                availableDates,
                fullyBookedDates,
                closedDates,
            },
            meta: {
                month,
                totalDevices: devices.length,
                branchOpenHour: openHour,
                branchCloseHour: closeHour,
            },
        });
    }
    catch (error) {
        console.error("Get available dates error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil tanggal tersedia",
        });
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
        const { deviceId, bookingDate, durationMinutes } = req.query;
        if (!deviceId || !bookingDate || !durationMinutes) {
            res.status(400).json({
                success: false,
                message: "Device ID, booking date, dan duration wajib diisi",
            });
            return;
        }
        const deviceIdBigInt = BigInt(deviceId);
        const duration = parseInt(durationMinutes);
        // Get branch with open/close time
        const branch = await prisma_1.default.branch.findUnique({
            where: { id: branchId },
        });
        if (!branch) {
            res.status(404).json({
                success: false,
                message: "Cabang tidak ditemukan",
            });
            return;
        }
        // Get device with bookings and exceptions
        const device = await prisma_1.default.roomAndDevice.findUnique({
            where: { id: deviceIdBigInt },
            include: {
                orderItems: {
                    where: {
                        order: {
                            status: {
                                in: ["pending", "paid", "checked_in"],
                            },
                        },
                    },
                    include: {
                        order: {
                            select: {
                                bookingStart: true,
                                bookingEnd: true,
                            },
                        },
                    },
                },
                availabilityExceptions: true,
            },
        });
        if (!device || device.branchId !== branchId) {
            res.status(404).json({
                success: false,
                message: "Device tidak ditemukan di cabang ini",
            });
            return;
        }
        // Generate time slots
        const targetDate = new Date(bookingDate);
        const slots = [];
        // Default: 09:00 - 23:00, atau gunakan branch open/close time
        const startHour = branch.openTime
            ? new Date(branch.openTime).getUTCHours()
            : 9;
        const endHour = branch.closeTime
            ? new Date(branch.closeTime).getUTCHours()
            : 23;
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const slotStart = new Date(targetDate);
                slotStart.setHours(hour, minute, 0, 0);
                const slotEnd = new Date(slotStart);
                slotEnd.setMinutes(slotEnd.getMinutes() + duration);
                // Check if slot end exceeds closing time
                if (slotEnd.getHours() > endHour) {
                    continue;
                }
                // Check availability
                let isAvailable = true;
                // Check exceptions
                const hasException = device.availabilityExceptions.some((exc) => slotStart >= exc.startAt && slotStart < exc.endAt);
                if (hasException)
                    isAvailable = false;
                // Check bookings
                const hasBooking = device.orderItems.some((item) => {
                    const bookingStart = item.order.bookingStart;
                    const bookingEnd = item.order.bookingEnd;
                    // Check if slots overlap
                    return slotStart < bookingEnd && slotEnd > bookingStart;
                });
                if (hasBooking)
                    isAvailable = false;
                // Check if time has passed (for today)
                const now = new Date();
                if (slotStart < now)
                    isAvailable = false;
                slots.push({
                    time: `${hour.toString().padStart(2, "0")}:${minute
                        .toString()
                        .padStart(2, "0")}`,
                    isAvailable,
                });
            }
        }
        res.status(200).json({
            success: true,
            data: slots,
        });
    }
    catch (error) {
        console.error("Get available times error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil jam tersedia",
        });
    }
};
exports.getAvailableTimes = getAvailableTimes;
/**
 * GET /booking/branches/:branchId/categories
 * Mendapatkan kategori berdasarkan device type dan version
 */
const getAvailableCategories = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        // Get categories untuk device type ini
        const categories = await prisma_1.default.category.findMany({
            where: {
                branchId,
            },
            include: {
                _count: {
                    select: {
                        roomAndDevices: {
                            where: {
                                status: "available",
                            },
                        },
                    },
                },
                roomAndDevices: {
                    where: {
                        status: "available",
                    },
                    select: {
                        deviceType: true,
                        version: true,
                    },
                    distinct: ["deviceType", "version"],
                },
            },
            orderBy: { tier: "asc" },
        });
        const categoriesWithAvailability = categories.map((category) => ({
            id: category.id.toString(),
            name: category.name,
            description: category.description,
            pricePerHour: category.pricePerHour.toString(),
            amenities: category.amenities,
            availableDeviceCount: category._count.roomAndDevices,
            isAvailable: category._count.roomAndDevices > 0,
            deviceTypes: category.roomAndDevices.map((device) => ({
                deviceType: device.deviceType,
                version: device.version,
            })),
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        }));
        res.status(200).json({
            success: true,
            data: categoriesWithAvailability,
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
        const BUFFER_MINUTES = 10; // Buffer untuk persiapan sebelum dan sesudah booking
        // Parse waktu yang dipilih user
        const [hours, minutes] = startTime.split(":").map(Number);
        const targetStart = new Date(bookingDate);
        targetStart.setHours(hours, minutes, 0, 0);
        const targetEnd = new Date(targetStart);
        targetEnd.setMinutes(targetEnd.getMinutes() + duration);
        // Get devices
        const where = {
            branchId,
            categoryId: categoryIdBigInt,
            status: "available",
        };
        const devices = await prisma_1.default.roomAndDevice.findMany({
            where,
            include: {
                category: true,
                orderItems: {
                    where: {
                        order: {
                            status: {
                                in: ["pending", "paid", "checked_in"],
                            },
                        },
                    },
                    include: {
                        order: {
                            select: {
                                bookingStart: true,
                                bookingEnd: true,
                                status: true,
                            },
                        },
                    },
                },
                availabilityExceptions: true,
            },
            orderBy: { roomNumber: "asc" },
        });
        // Filter hanya yang available untuk slot waktu ini
        const availableRooms = devices
            .map((device) => {
            let isAvailable = true;
            let unavailableReason = null;
            // Check exceptions (maintenance terjadwal)
            const hasException = device.availabilityExceptions.some((exc) => targetStart >= exc.startAt && targetStart < exc.endAt);
            if (hasException) {
                isAvailable = false;
                unavailableReason = "Under maintenance";
            }
            // Check existing bookings dengan buffer
            const conflictingBooking = device.orderItems.find((item) => {
                const bookingStart = item.order.bookingStart;
                const bookingEnd = new Date(item.order.bookingEnd);
                // Tambah buffer 10 menit setelah booking selesai
                bookingEnd.setMinutes(bookingEnd.getMinutes() + BUFFER_MINUTES);
                // Check overlap
                return targetStart < bookingEnd && targetEnd > bookingStart;
            });
            if (conflictingBooking) {
                isAvailable = false;
                unavailableReason = "Already booked";
            }
            return {
                device,
                isAvailable,
                unavailableReason,
            };
        })
            .filter((item) => item.isAvailable) // ⭐ HANYA return yang available
            .map((item) => ({
            id: item.device.id.toString(),
            roomNumber: item.device.roomNumber,
            name: item.device.name,
            type: item.device.deviceType,
            version: item.device.version,
            pricePerHour: item.device.pricePerHour.toString(),
            categoryName: item.device.category?.name,
            categoryTier: item.device.category?.tier,
        }));
        // Jika tidak ada room available
        if (availableRooms.length === 0) {
            res.status(200).json({
                success: true,
                data: [],
                message: "Tidak ada room yang tersedia untuk waktu ini. Silakan pilih waktu lain.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: availableRooms,
            meta: {
                bookingDate: bookingDate,
                startTime: startTime,
                durationMinutes: duration,
                availableCount: availableRooms.length,
            },
        });
    }
    catch (error) {
        console.error("Get rooms error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data ruangan",
        });
    }
};
exports.getAvailableRoomsAndDevices = getAvailableRoomsAndDevices;
/**
 * POST /booking/calculate-price
 * Menghitung harga booking sebelum checkout
 */
const calculateBookingPrice = async (req, res) => {
    try {
        const { branchId, deviceId, categoryId, bookingDate, startTime, durationMinutes, } = req.body;
        if (!branchId ||
            !deviceId ||
            !categoryId ||
            !bookingDate ||
            !startTime ||
            !durationMinutes) {
            res.status(400).json({
                success: false,
                message: "Semua field wajib diisi",
            });
            return;
        }
        const branchIdBigInt = BigInt(branchId);
        const deviceIdBigInt = BigInt(deviceId);
        const categoryIdBigInt = BigInt(categoryId);
        // Get device
        const device = await prisma_1.default.roomAndDevice.findUnique({
            where: { id: deviceIdBigInt },
            include: {
                category: true,
            },
        });
        if (!device) {
            res.status(404).json({
                success: false,
                message: "Device tidak ditemukan",
            });
            return;
        }
        // Get category
        const category = await prisma_1.default.category.findUnique({
            where: { id: categoryIdBigInt },
        });
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Kategori tidak ditemukan",
            });
            return;
        }
        // Calculate base amount
        const hours = durationMinutes / 60;
        const baseAmount = Number(device.pricePerHour) * hours;
        // Calculate category fee
        const categoryFee = Number(category.pricePerHour) * hours;
        // Calculate advance booking fee
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingDateObj = new Date(bookingDate);
        const daysFromToday = Math.floor((bookingDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        let advanceBookingFee = 0;
        if (daysFromToday > 0) {
            const advancePrice = await prisma_1.default.advanceBookingPrice.findFirst({
                where: {
                    branchId: branchIdBigInt,
                    daysInAdvance: {
                        lte: daysFromToday,
                    },
                },
                orderBy: {
                    daysInAdvance: "desc",
                },
            });
            if (advancePrice) {
                advanceBookingFee = Number(advancePrice.additionalFee) * hours;
            }
        }
        // Total
        const totalAmount = baseAmount + categoryFee + advanceBookingFee;
        res.status(200).json({
            success: true,
            data: {
                baseAmount: baseAmount.toFixed(2),
                categoryFee: categoryFee.toFixed(2),
                advanceBookingFee: advanceBookingFee.toFixed(2),
                totalAmount: totalAmount.toFixed(2),
                breakdown: {
                    devicePricePerHour: device.pricePerHour.toString(),
                    categoryPricePerHour: category.pricePerHour.toString(),
                    durationHours: hours,
                    daysInAdvance: daysFromToday,
                },
            },
        });
    }
    catch (error) {
        console.error("Calculate price error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghitung harga",
        });
    }
};
exports.calculateBookingPrice = calculateBookingPrice;
//# sourceMappingURL=BookingFlowController.js.map