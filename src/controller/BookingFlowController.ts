import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { fetchMonthlyData } from "../helper/bookingAvailability/fetchMonthlyData";
import { getBranchOperatingHours } from "../helper/bookingAvailability/getBranchOperatingHours";
import { isPastDate } from "../helper/bookingAvailability/isPastDate";
import { isDateClosed } from "../helper/bookingAvailability/isDateClosed";
import { calculateDateAvailability } from "../helper/bookingAvailability/calculateDateAvailability";

/**
 * GET /booking/branches
 * Mendapatkan semua cabang untuk halaman booking
 */
export const getBranches = async (
  _req: Request,
  res: Response
): Promise<void> => {
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

    const serialized = branches.map((branch) => ({
      id: branch.id.toString(),
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      openTime: branch.openTime,
      closeTime: branch.closeTime,
      amenities: branch.amenities,
      availableDeviceCount: branch._count.roomAndDevices,
    }));

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
 * GET /booking/branches/:branchId/available-dates
 * Mendapatkan tanggal yang tersedia untuk booking
 */
export const getAvailableDates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { month } = req.query;

    // Parse month
    const [year, monthNum] = (month as string).split("-").map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    // Get branch with operating hours
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
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
    const devices = await prisma.roomAndDevice.findMany({
      where: {
        branchId: branchId,
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

    const [orders, exceptions, holidays] = await fetchMonthlyData(
      branchId,
      deviceIds,
      startDate,
      endDate
    );

    const holidayDates = new Set(
      holidays.map((h) => new Date(h.date).toISOString().split("T")[0])
    );

    // Get operating hours
    const { openHour, closeHour, totalHours } = getBranchOperatingHours(
      branch.openTime,
      branch.closeTime
    );

    // Categorize dates
    const availableDates: string[] = [];
    const fullyBookedDates: string[] = [];
    const closedDates: string[] = [];

    // Loop through each date in the month
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const currentDate = new Date(d);

      const dateStr = currentDate.toISOString().split("T")[0];

      // Skip past dates
      if (isPastDate(currentDate)) continue;

      // Check if branch is closed
      if (
        isDateClosed(
          currentDate,
          openHour,
          closeHour,
          exceptions,
          holidayDates,
          devices.length
        )
      ) {
        closedDates.push(dateStr);
        continue;
      }

      // Calculate availability
      const { availableDevices, bookedDevices } = calculateDateAvailability(
        currentDate,
        devices,
        orders,
        exceptions,
        totalHours,
        openHour,
        closeHour
      );

      // Categorize
      if (availableDevices === 0 && bookedDevices > 0) {
        fullyBookedDates.push(dateStr);
      } else if (availableDevices > 0) {
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
    const { bookingDate } = req.query;

    if (!bookingDate) {
      res.status(400).json({
        success: false,
        message: "Device ID, booking date, dan duration wajib diisi",
      });
      return;
    }

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

    // Check if date is holiday
    const targetDate = new Date(bookingDate as string);

    const holiday = await prisma.branchHoliday.findFirst({
      where: {
        branchId,
        date: targetDate,
      },
    });

    if (holiday) {
      res.status(200).json({
        success: true,
        data: [],
        message: `Branch tutup: ${holiday.name}`,
      });
      return;
    }

    // Get all devices in this branch
    const devices = await prisma.roomAndDevice.findMany({
      where: {
        branchId,
        status: { not: "maintenance" },
      },
      include: {
        orderItems: {
          where: {
            order: {
              status: { in: ["pending", "paid", "checked_in"] },
              bookingStart: {
                gte: new Date(targetDate.setHours(0, 0, 0, 0)),
                lte: new Date(targetDate.setHours(23, 59, 59, 999)),
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
        availabilityExceptions: {
          where: {
            startAt: {
              lte: new Date(targetDate.setHours(23, 59, 59, 999)),
            },
            endAt: {
              gte: new Date(targetDate.setHours(0, 0, 0, 0)),
            },
          },
        },
      },
    });

    if (devices.length === 0) {
      res.status(200).json({
        success: true,
        data: [],
        message: "Tidak ada device tersedia di branch ini",
      });
      return;
    }

    // Generate time slots
    const slots = [];
    const now = new Date();

    const startHour = branch.openTime
      ? new Date(branch.openTime).getUTCHours()
      : 9;
    const endHour = branch.closeTime
      ? new Date(branch.closeTime).getUTCHours()
      : 23;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = new Date(bookingDate as string);
        slotStart.setHours(hour, minute, 0, 0);

        // Skip past times
        if (slotStart < now) continue;

        // Count available devices for this slot
        let availableDeviceCount = 0;

        for (const device of devices) {
          let isAvailable = true;

          // Check exceptions
          const hasException = device.availabilityExceptions.some(
            (exc) => slotStart >= exc.startAt && slotStart < exc.endAt
          );
          if (hasException) {
            isAvailable = false;
          }

          // Check bookings (cek apakah slot START ini bentrok dengan booking)
          const hasBooking = device.orderItems.some((item) => {
            const bookingStart = item.order.bookingStart;
            const bookingEnd = item.order.bookingEnd;
            return slotStart >= bookingStart && slotStart < bookingEnd;
          });
          if (hasBooking) {
            isAvailable = false;
          }

          if (isAvailable) {
            availableDeviceCount++;
          }
        }

        slots.push({
          time: `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`,
          availableDeviceCount,
          isAvailable: availableDeviceCount > 0,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: slots,
      meta: {
        totalDevices: devices.length,
        note: "availableDeviceCount menunjukkan jumlah device yang bebas di waktu ini. Validasi durasi dilakukan di step berikutnya.",
      },
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
 * GET /booking/branches/:branchId/duration-options
 * Mendapatkan opsi durasi booking berdasarkan tanggal dan jam mulai
 */
export const getDurationOptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { bookingDate, startTime } = req.query;

    if (!bookingDate || !startTime) {
      res.status(400).json({
        success: false,
        message: "Booking date dan start time wajib diisi",
      });
      return;
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime as string)) {
      res.status(400).json({
        success: false,
        message: "Format start time tidak valid. Gunakan format HH:MM",
      });
      return;
    }

    // Get branch
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: {
        id: true,
        name: true,
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

    // Parse start time
    const [startHour, startMinute] = (startTime as string)
      .split(":")
      .map(Number);

    // Get close hour from branch
    const closeHour = branch.closeTime
      ? new Date(branch.closeTime).getUTCHours()
      : 23;

    // Create date objects for calculation
    const bookingDateObj = new Date(bookingDate as string);
    const startDateTime = new Date(bookingDateObj);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const closeDateTime = new Date(bookingDateObj);
    closeDateTime.setHours(closeHour, 0, 0, 0);

    // Calculate maximum duration in minutes
    const maxDurationMs = closeDateTime.getTime() - startDateTime.getTime();
    const maxDurationMinutes = Math.floor(maxDurationMs / (1000 * 60));

    if (maxDurationMinutes <= 0) {
      res.status(400).json({
        success: false,
        message: "Start time melebihi atau sama dengan jam tutup branch",
      });
      return;
    }

    // Generate duration options (1 jam = 60 menit, step 30 menit)
    const durationOptions = [];
    const minDuration = 60; // Minimum 1 jam
    const step = 30; // Step 30 menit

    for (
      let duration = minDuration;
      duration <= maxDurationMinutes;
      duration += step
    ) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;

      let label = "";
      if (hours > 0) {
        label += `${hours} jam`;
      }
      if (minutes > 0) {
        if (hours > 0) label += " ";
        label += `${minutes} menit`;
      }

      durationOptions.push({
        value: duration,
        label: label,
        hours: hours,
        minutes: minutes,
      });
    }

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
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);

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
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { categoryId, bookingDate, startTime, durationMinutes } = req.query;

    const categoryIdBigInt = BigInt(categoryId as string);
    const duration = parseInt(durationMinutes as string);
    const BUFFER_MINUTES = 10; // Buffer untuk persiapan sebelum dan sesudah booking

    // Parse waktu yang dipilih user
    const [hours, minutes] = (startTime as string).split(":").map(Number);
    const targetStart = new Date(bookingDate as string);
    targetStart.setHours(hours, minutes, 0, 0);

    const targetEnd = new Date(targetStart);
    targetEnd.setMinutes(targetEnd.getMinutes() + duration);

    // Get devices
    const where: any = {
      branchId,
      categoryId: categoryIdBigInt,
      status: "available",
    };

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
        const hasException = device.availabilityExceptions.some(
          (exc) => targetStart >= exc.startAt && targetStart < exc.endAt
        );
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
        message:
          "Tidak ada room yang tersedia untuk waktu ini. Silakan pilih waktu lain.",
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
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data ruangan",
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
