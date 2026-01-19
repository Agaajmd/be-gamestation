import { Request, Response } from "express";
import { prisma } from "../database";

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

// Error
import { handleError } from "../helper/responseHelper";

/**
 * GET /booking/branches
 * Mendapatkan semua cabang untuk halaman booking
 */
export const getBranches = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branches = await getBranchesService();

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
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

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

    const { durationOptions, closeHour, maxDurationMinutes } =
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
        closeTime: `${closeHour.toString().padStart(2, "0")}:00`,
        maxDurationMinutes: maxDurationMinutes,
        note: "Durasi minimum 1 jam, step 30 menit",
      },
    });
  } catch (error) {
    console.error("Get duration options error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil opsi durasi",
    });
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
    
    const {order, totalItems, totalAmount} = await getBookingCartService(userId);

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        totalAmount,
        order,
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
    const {
      branchId,
      deviceId,
      categoryId,
      bookingDate,
      startTime,
      durationMinutes,
    } = req.body;

    if (
      !branchId ||
      !deviceId ||
      !categoryId ||
      !bookingDate ||
      !startTime ||
      !durationMinutes
    ) {
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
    const device = await prisma.roomAndDevice.findUnique({
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
    const category = await prisma.category.findUnique({
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
    const daysFromToday = Math.floor(
      (bookingDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    let advanceBookingFee = 0;
    if (daysFromToday > 0) {
      const advancePrice = await prisma.advanceBookingPrice.findFirst({
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
  } catch (error) {
    console.error("Calculate price error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghitung harga",
    });
  }
};
