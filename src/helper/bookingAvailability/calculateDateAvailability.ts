import { hasDeviceException } from "./hasDeviceException";
import { getDeviceOrdersForDate } from "./getDeviceOrdersForDate";
import { calculateBookedHours } from "./calculatedBookedHours";

/**
 * Calculate availability for a single date
 */
export const calculateDateAvailability = (
  currentDate: Date,
  devices: Array<{ id: bigint }>,
  orders: Array<{
    orderItems: Array<{
      roomAndDeviceId: bigint;
      bookingStart: Date;
      bookingEnd: Date;
    }>;
  }>,
  exceptions: Array<{
    roomAndDeviceId: bigint;
    startAt: Date;
    endAt: Date;
  }>,
  totalOperatingHours: number,
  openHour: number,
  closeHour: number
): { availableDevices: number; bookedDevices: number } => {
  let availableDevices = 0;
  let bookedDevices = 0;

  for (const device of devices) {
    // Skip device with exception
    if (hasDeviceException(device.id, currentDate, exceptions)) {
      continue;
    }

    // Get orders for this device on this date
    const deviceOrders = getDeviceOrdersForDate(device.id, currentDate, orders);

    // Calculate booked hours
    const bookedHours = calculateBookedHours(
      deviceOrders,
      currentDate,
      openHour,
      closeHour
    );

    const availableHours = totalOperatingHours - bookedHours;

    if (availableHours > 0) {
      availableDevices++;
    } else if (bookedHours > 0) {
      bookedDevices++;
    }
  }

  return { availableDevices, bookedDevices };
};
