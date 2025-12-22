import { Request, Response } from "express";
import prisma from "../lib/prisma";

/**
 * GET /booking/branches
 * Mendapatkan semua cabang untuk halaman booking
 */
export const getBranches = async (res: Response): Promise<void> => {
  try {
    const branches = await prisma.branch.findMany({
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

    const serialized = JSON.parse(
      JSON.stringify(branches, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serialized,
    });
  } catch (error) {
    console.error("Get branches error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data cabang",
    });
  }
};

/**
 * GET /booking/branches/:branchId/device-types
 * Mendapatkan tipe device yang tersedia di cabang
 */
export const getAvailableDeviceTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);

    // Cek branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      res.status(404).json({
        success: false,
        message: "Cabang tidak ditemukan",
      });
      return;
    }

    // Get device types yang available (tidak semua maintenance/inused)
    const devices = await prisma.roomAndDevice.findMany({
      where: {
        branchId,
        status: "available",
      },
      select: {
        deviceType: true,
        version: true,
        pricePerHour: true,
      },
      distinct: ["deviceType", "version"],
      orderBy: [{ deviceType: "asc" }, { version: "asc" }],
    });

    // Group by type
    const grouped = devices.reduce((acc: any, device) => {
      const type = device.deviceType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        version: device.version,
        pricePerHour: device.pricePerHour.toString(),
      });
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    console.error("Get device types error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil tipe device",
    });
  }
};

/**
 * GET /booking/branches/:branchId/categories
 * Mendapatkan kategori berdasarkan device type dan version
 */
export const getAvailableCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { deviceType, deviceVersion } = req.query;

    if (!deviceType) {
      res.status(400).json({
        success: false,
        message: "Device type wajib diisi",
      });
      return;
    }

    // Get categories untuk device type ini
    const categories = await prisma.category.findMany({
      where: {
        branchId,
      },
      include: {
        _count: {
          select: {
            roomAndDevices: {
              where: {
                status: "available",
                deviceType: deviceType as any,
                ...(deviceVersion && { version: deviceVersion as any }),
              },
            },
          },
        },
      },
      orderBy: { tier: "asc" },
    });

    // Filter kategori yang punya device available
    const available = categories.filter((cat) => cat._count.roomAndDevices > 0);

    const serialized = JSON.parse(
      JSON.stringify(available, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serialized,
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
 * GET /booking/branches/:branchId/rooms
 * Mendapatkan ruangan (device) yang tersedia berdasarkan filter
 */
export const getAvailableRooms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { deviceType, deviceVersion, categoryId, bookingDate, startTime } =
      req.query;

    if (!deviceType || !categoryId) {
      res.status(400).json({
        success: false,
        message: "Device type dan category ID wajib diisi",
      });
      return;
    }

    const categoryIdBigInt = BigInt(categoryId as string);

    // Get devices
    const where: any = {
      branchId,
      type: deviceType,
      categoryId: categoryIdBigInt,
      status: "active",
    };

    if (deviceVersion) {
      where.version = deviceVersion;
    }

    const devices = await prisma.roomAndDevice.findMany({
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
              },
            },
          },
        },
        availabilityExceptions: true,
      },
      orderBy: { roomNumber: "asc" },
    });

    // Check availability untuk setiap device
    let targetDate: Date | null = null;
    let targetStart: Date | null = null;

    if (bookingDate && startTime) {
      const dateStr = bookingDate as string;
      const timeStr = startTime as string;
      targetDate = new Date(`${dateStr}T${timeStr}`);
      targetStart = targetDate;
    }

    const roomsWithAvailability = devices.map((device) => {
      let isAvailable = true;

      // Check existing bookings
      if (targetStart && device.orderItems.length > 0) {
        const hasBooking = device.orderItems.some(
          (item: any) =>
            targetStart >= item.order.bookingStart &&
            targetStart < item.order.bookingEnd
        );
        if (hasBooking) isAvailable = false;
      }

      return {
        id: device.id.toString(),
        roomNumber: device.roomNumber,
        type: device.deviceType,
        version: device.version,
        pricePerHour: device.pricePerHour.toString(),
        isAvailable,
      };
    });

    res.status(200).json({
      success: true,
      data: roomsWithAvailability,
    });
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data ruangan",
    });
  }
};

/**
 * GET /booking/branches/:branchId/available-dates
 * Mendapatkan tanggal yang tersedia untuk booking
 */
export const getAvailableDates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: "Start date dan end date wajib diisi",
      });
      return;
    }

    // Get branch info
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        advanceBookingPrices: {
          orderBy: { daysInAdvance: "asc" },
        },
      },
    });

    if (!branch) {
      res.status(404).json({
        success: false,
        message: "Cabang tidak ditemukan",
      });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      const daysFromToday = Math.floor(
        (currentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Find applicable advance booking fee
      let advanceFee = 0;
      if (daysFromToday > 0) {
        const applicableFee = branch.advanceBookingPrices
          .reverse()
          .find((price) => daysFromToday >= price.daysInAdvance);

        if (applicableFee) {
          advanceFee = Number(applicableFee.additionalFee);
        }
      }

      dates.push({
        date: currentDate.toISOString().split("T")[0],
        daysFromToday,
        advanceBookingFee: advanceFee,
        isToday: daysFromToday === 0,
      });
    }

    res.status(200).json({
      success: true,
      data: dates,
    });
  } catch (error) {
    console.error("Get available dates error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil tanggal tersedia",
    });
  }
};

/**
 * GET /booking/branches/:branchId/available-times
 * Mendapatkan jam yang tersedia untuk booking di tanggal tertentu
 */
export const getAvailableTimes = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const deviceIdBigInt = BigInt(deviceId as string);
    const duration = parseInt(durationMinutes as string);

    // Get branch with open/close time
    const branch = await prisma.branch.findUnique({
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
    const device = await prisma.roomAndDevice.findUnique({
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
    const targetDate = new Date(bookingDate as string);
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
        const hasException = device.availabilityExceptions.some(
          (exc) => slotStart >= exc.startAt && slotStart < exc.endAt
        );
        if (hasException) isAvailable = false;

        // Check bookings
        const hasBooking = device.orderItems.some((item) => {
          const bookingStart = item.order.bookingStart;
          const bookingEnd = item.order.bookingEnd;

          // Check if slots overlap
          return slotStart < bookingEnd && slotEnd > bookingStart;
        });
        if (hasBooking) isAvailable = false;

        // Check if time has passed (for today)
        const now = new Date();
        if (slotStart < now) isAvailable = false;

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
  } catch (error) {
    console.error("Get available times error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil jam tersedia",
    });
  }
};

/**
 * POST /booking/calculate-price
 * Menghitung harga booking sebelum checkout
 */
export const calculateBookingPrice = async (
  req: Request,
  res: Response
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
      (bookingDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
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
