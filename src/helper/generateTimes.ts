export interface TimeSlot {
  time: string;
  availableDeviceCount: number;
  isAvailable: boolean;
}

interface Branch {
  openTime?: string | Date | null;
  closeTime?: string | Date | null;
}

interface Device {
  availabilityExceptions: Array<{
    startAt: Date;
    endAt: Date;
  }>;
  orderItems: Array<{
    bookingStart: Date;
    bookingEnd: Date;
  }>;
}

/**
 * Parse time value (Date or ISO string) and extract hours
 */
const extractHourFromTime = (
  time: string | Date | undefined | null,
): number => {
  if (!time) return 9; // default

  // If it's a string, parse it as HH:mm:ss format
  if (typeof time === "string") {
    const parts = time.split(":");
    if (parts.length >= 1) {
      return parseInt(parts[0], 10);
    }
  }

  // If it's a Date object from database (PostgreSQL Time)
  // PostgreSQL Time fields don't have timezone - they're stored as plain time values
  // Prisma returns them as Date objects, and getUTCHours() gives us the stored time
  if (time instanceof Date) {
    return time.getUTCHours();
  }

  return 9; // default
};

export function generateTimeSlots(
  bookingDate: string,
  branch: Branch,
  devices: Device[],
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();

  const startHour = extractHourFromTime(branch.openTime);
  const endHour = extractHourFromTime(branch.closeTime);

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slotStart = new Date(bookingDate);
      slotStart.setHours(hour, minute, 0, 0);

      if (slotStart < now) continue;

      let availableDeviceCount = 0;

      for (const device of devices) {
        let isAvailable = true;

        const hasException = device.availabilityExceptions.some(
          (exc) => slotStart >= exc.startAt && slotStart < exc.endAt,
        );
        if (hasException) isAvailable = false;

        const hasBooking = device.orderItems.some(
          (item) =>
            slotStart >= item.bookingStart && slotStart < item.bookingEnd,
        );
        if (hasBooking) isAvailable = false;

        if (isAvailable) availableDeviceCount++;
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

  return slots;
}
