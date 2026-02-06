// Repository
import { BranchRepository } from "../../repository/branchRepository";
import { RoomAndDeviceRepository } from "../../repository/roomAndDeviceRepository";
import { HolidayRepository } from "../../repository/holidayRepository";
import { CategoryRepository } from "../../repository/categoryRepository";
import { BranchPaymentMethodRepository } from "../../repository/branchPaymentMethodRepository";

// Queries
import { RoomAndDeviceQuery } from "../../queries/roomAndDeviceQuery";
import { BookingCartQuery } from "../../queries/bookingCartQuery";

// Error
import { BranchNotFoundError } from "../../errors/BranchError/branchError";
import { RoomAndDeviceUnavailableError } from "../../errors/RoomAndDeviceError/roomAndDeviceError";
import { HolidayError } from "../../errors/HolidayError/holidayError";

// Helpers
import { fetchMonthlyData } from "../../helper/bookingAvailability/fetchMonthlyData";
import { getBranchOperatingHours } from "../../helper/bookingAvailability/getBranchOperatingHours";
import { categorizeDates } from "../../helper/categorizeDates";
import { generateTimeSlots } from "../../helper/generateTimes";
import { calculateMaximumDuration } from "../../helper/calculateMaximumDuration";
import { generateDurationOptions } from "../../helper/generateDurationOptions";
import { checkDeviceAvailability } from "../../helper/checkDeviceAvailability";

// Types
import { GetAvailableTimesResult } from "./type/getAvailableTimesResult";

// Service to get all branches
// Jika user sudah punya cart order, hanya return branch yang sama dengan cart
export async function getBranchesService(userId: bigint) {
  const branches = await BranchRepository.findAvailableBranches();

  // Check apakah user sudah punya cart order
  const cartOrder = await BookingCartQuery.findBookingCartByUserId(userId);

  // Jika ada cart order, filter branches untuk hanya return branch yang sama
  if (cartOrder) {
    return branches.filter((branch) => branch.id === cartOrder.branchId);
  }

  return branches;
}

// Service to get available dates for a branch
export async function getAvailableDatesService(
  branchId: bigint,
  startDate: Date,
  endDate: Date,
) {
  const [branch, availableRoomsAndDevices] = await Promise.all([
    BranchRepository.findOpenAndCloseTimeById(branchId),
    RoomAndDeviceRepository.findAvailableByBranchId(branchId),
  ]);

  if (!branch) {
    throw new BranchNotFoundError();
  }

  if (availableRoomsAndDevices.length === 0) {
    throw new RoomAndDeviceUnavailableError();
  }

  const roomAndDeviceIds = availableRoomsAndDevices.map((item) => item.id);

  const [orders, exceptions, holidays] = await fetchMonthlyData(
    branchId,
    roomAndDeviceIds,
    startDate,
    endDate,
  );

  const { openHour, closeHour, totalHours } = getBranchOperatingHours(
    branch.openTime,
    branch.closeTime,
  );

  const { availableDates, fullyBookedDates, closedDates } = categorizeDates(
    startDate,
    endDate,
    availableRoomsAndDevices,
    orders,
    openHour,
    closeHour,
    totalHours,
    exceptions,
    holidays.map((h) => h.date),
  );

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
export async function getAvailableTimesService(
  branchId: bigint,
  date: Date,
): Promise<GetAvailableTimesResult> {
  const branch = await BranchRepository.findById(branchId);

  if (!branch) {
    throw new BranchNotFoundError();
  }

  const isDateHoliday = await HolidayRepository.isDateHoliday(branchId, date);

  if (isDateHoliday) {
    throw new HolidayError();
  }

  const { openHour, closeHour } = getBranchOperatingHours(
    branch.openTime,
    branch.closeTime,
  );

  const roomsAndDevices =
    await RoomAndDeviceRepository.findByBranchIdWithOrdersAndExceptions(
      branchId,
      date,
      openHour,
      closeHour,
    );

  if (roomsAndDevices.length === 0) {
    throw new RoomAndDeviceUnavailableError();
  }

  const timeSlots = generateTimeSlots(
    date.toISOString(),
    {
      openTime: branch.openTime?.toISOString(),
      closeTime: branch.closeTime?.toISOString(),
    },
    roomsAndDevices,
  );

  return { timeSlots, totalDevices: roomsAndDevices.length };
}

// Service to get duration options
export async function getDurationOptionsService(
  branchId: bigint,
  bookingDate: string,
  startHour: number,
  startMinute: number,
) {
  const branch = await BranchRepository.findById(branchId);

  if (!branch) {
    throw new BranchNotFoundError();
  }

  const maxDurationMinutes = calculateMaximumDuration(
    bookingDate,
    startHour,
    startMinute,
    branch.closeTime,
  );

  const durationOptions = generateDurationOptions(maxDurationMinutes);

  return { durationOptions, closeTime: branch.closeTime, maxDurationMinutes };
}

// Service to get available categories for a branch
export async function getAvailableCategoriesService(branchId: bigint) {
  const availableRoomsAndDevices =
    await RoomAndDeviceRepository.findAvailableByBranchId(branchId);

  if (availableRoomsAndDevices.length === 0) {
    throw new RoomAndDeviceUnavailableError();
  }

  const categories =
    await CategoryRepository.findAllByBranchIdWithRoomAndDevice(branchId);

  return categories;
}

// Service to get available room and device based on category, booking date, start time, and duration
export async function getAvailableRoomAndDeviceService(
  branchId: bigint,
  categoryId: bigint,
  bookingDate: string,
  startHour: number,
  startMinute: number,
  durationMinutes: number,
) {
  const targetStart = new Date(bookingDate);
  targetStart.setUTCHours(startHour, startMinute, 0, 0);
  const targetEnd = new Date(targetStart);
  targetEnd.setMinutes(targetEnd.getMinutes() + durationMinutes);

  const roomsAndDevices =
    await RoomAndDeviceQuery.findAvailableRoomAndDevicesByBranchAndCategory(
      branchId,
      categoryId,
    );

  const availableRoomsAndDevices = roomsAndDevices
    .map((roomAndDevice) => {
      const availability = checkDeviceAvailability(
        roomAndDevice,
        targetStart,
        targetEnd,
      );

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
    throw new RoomAndDeviceUnavailableError();
  }

  return availableRoomsAndDevices;
}

// Service to get booking cart
export async function getBookingCartService(userId: bigint) {
  const cartOrder = await BookingCartQuery.findBookingCartByUserId(userId);

  const totalItems = cartOrder ? cartOrder.orderItems.length : 0;
  const totalAmount = cartOrder ? Number(cartOrder.totalAmount) : 0;

  const paymentMethods = cartOrder
    ? await BranchPaymentMethodRepository.findActiveByBranchId(
        cartOrder.branchId,
      )
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
export async function validateBranchForOrderService(
  userId: bigint,
  requestedBranchId: bigint,
) {
  const cartOrder = await BookingCartQuery.findBookingCartByUserId(userId);

  if (cartOrder && cartOrder.branchId !== requestedBranchId) {
    throw new Error(
      `Anda sudah memiliki order di branch ID ${cartOrder.branchId}. Tidak bisa menambah order dari branch berbeda. Mohon selesaikan atau batalkan pesanan sebelumnya.`,
    );
  }

  return true;
}
