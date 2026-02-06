import { Request, Response } from "express";
// import { prisma } from "../database";

// Service
import {
  getBranchesService,
  getAvailableDatesService,
  getAvailableTimesService,
  getDurationOptionsService,
  getAvailableCategoriesService,
  getAvailableRoomAndDeviceService,
  getBookingCartService,
} from "../service/BookingService/bookingService";

import { calculateBookingPriceService } from "../service/OrderService/orderService";

// Error
import { handleError } from "../helper/responseHelper";

/**
 * GET /booking/branches
 * Mendapatkan semua cabang untuk halaman booking
 * Jika user sudah punya cart order, hanya return branch yang sama
 */
export const getBranches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);
    const branches = await getBranchesService(userId);

    res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /booking/branches/:branchId/available-dates
 * Mendapatkan tanggal yang tersedia untuk booking
 */
export const getAvailableDates = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { month } = req.query;

    // Parse month
    const [year, monthNum] = (month as string).split("-").map(Number);

    const startDate = new Date(Date.UTC(year, monthNum - 1, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));

    const {
      availableDates,
      fullyBookedDates,
      closedDates,
      openHour,
      closeHour,
      totalDevices,
    } = await getAvailableDatesService(branchId, startDate, endDate);

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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /booking/branches/:branchId/available-times
 * Mendapatkan jam yang tersedia untuk booking di tanggal tertentu
 */
export const getAvailableTimes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { bookingDate } = req.query;

    const date = new Date(bookingDate as string);

    const slots = await getAvailableTimesService(branchId, date);

    res.status(200).json({
      success: true,
      data: slots.timeSlots,
      meta: {
        totalDevices: slots.totalDevices,
        note: "availableDeviceCount menunjukkan jumlah device yang bebas di waktu ini. Validasi durasi dilakukan di step berikutnya.",
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /booking/branches/:branchId/duration-options
 * Mendapatkan opsi durasi booking berdasarkan tanggal dan jam mulai
 */
export const getDurationOptions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { bookingDate, startTime } = req.query;

    // Parse start time
    const [startHour, startMinute] = (startTime as string)
      .split(":")
      .map(Number);

    const { durationOptions, closeTime, maxDurationMinutes } =
      await getDurationOptionsService(
        branchId,
        bookingDate as string,
        startHour,
        startMinute,
      );

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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /booking/branches/:branchId/categories
 * Mendapatkan kategori berdasarkan device type dan version
 */
export const getAvailableCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);

    const categoriesWithAvailability =
      await getAvailableCategoriesService(branchId);

    const result = categoriesWithAvailability.map((category) => {
      const uniqueDeviceTypes = Array.from(
        new Map(
          category.roomAndDevices.map((d) => [
            `${d.deviceType}-${d.version}`,
            { deviceType: d.deviceType, version: d.version },
          ]),
        ).values(),
      );

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
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil kategori",
    });
  }
};

/**
 * GET /booking/branches/:branchId/rooms-and-devices
 * Mendapatkan room dan device yang tersedia berdasarkan filter
 */
export const getAvailableRoomsAndDevices = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { categoryId, bookingDate, startTime, durationMinutes } = req.query;

    const categoryIdBigInt = BigInt(categoryId as string);
    const duration = parseInt(durationMinutes as string);

    // Parse waktu yang dipilih user
    const [hours, minutes] = (startTime as string).split(":").map(Number);

    const availableRoomsAndDevices = await getAvailableRoomAndDeviceService(
      branchId,
      categoryIdBigInt,
      bookingDate as string,
      hours,
      minutes,
      duration,
    );

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
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /booking/cart
 * Mengambil data cart booking yang sudah diorder tapi belum checkout
 */
export const getBookingCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = BigInt(req.user!.userId);

    const { order, totalItems, totalAmount, paymentMethods } =
      await getBookingCartService(userId);

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        totalAmount,
        order,
        paymentMethods,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * POST /booking/calculate-price
 * Menghitung harga booking sebelum checkout
 */
export const calculateBookingPrice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { branchId, deviceId, categoryId, bookingDate, durationMinutes } =
      req.body;

    const branchIdBigInt = BigInt(branchId);
    const deviceIdBigInt = BigInt(deviceId);
    const categoryIdBigInt = BigInt(categoryId);

    const result = await calculateBookingPriceService(
      branchIdBigInt,
      deviceIdBigInt,
      categoryIdBigInt,
      bookingDate,
      durationMinutes,
    );

    res.status(200).json({
      success: true,
      data: {
        baseAmount: result.baseAmount.toFixed(2),
        categoryFee: result.categoryFee.toFixed(2),
        advanceBookingFee: result.advanceBookingFee.toFixed(2),
        totalAmount: result.totalAmount.toFixed(2),
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};
