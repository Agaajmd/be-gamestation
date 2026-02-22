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

const extractTimeFromValue = (
  time: Date | string | null,
): { hours: number; minutes: number } | null => {
  if (!time) return null;

  if (typeof time === "string") {
    const parts = time.split(":");
    if (parts.length >= 1) {
      const hours = parseInt(parts[0], 10);
      const minutes = parts.length >= 2 ? parseInt(parts[1], 10) : 0;
      return { hours, minutes };
    }
  }

  if (time instanceof Date) {
    return {
      hours: time.getUTCHours(),
      minutes: time.getUTCMinutes(),
    };
  }

  return null;
};

/**
 * Convert UTC date to local date in specified timezone
 */
const getLocalDateInTimezone = (date: Date, timezone: string): Date => {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const dateMap: Record<string, string> = {};

    parts.forEach(({ type, value }) => {
      dateMap[type] = value;
    });

    return new Date(
      `${dateMap.year}-${dateMap.month}-${dateMap.day}T${dateMap.hour}:${dateMap.minute}:${dateMap.second}Z`,
    );
  } catch (error) {
    // Fallback ke UTC jika timezone invalid
    return date;
  }
};

export function generateTimeSlots(
  bookingDate: string,
  branch: Branch,
  devices: Device[],
  timezone: string = "UTC",
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  // Get current time in branch timezone
  const nowUTC = new Date();
  const nowInTimezone = getLocalDateInTimezone(nowUTC, timezone);

  const startTime = extractTimeFromValue(branch.openTime);
  const endTime = extractTimeFromValue(branch.closeTime);

  const startHour = startTime?.hours ?? 9;
  const startMinute = startTime?.minutes ?? 0;
  const endHour = endTime?.hours ?? 23;
  const endMinute = endTime?.minutes ?? 0;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip jika sudah melewati closing time
      if (hour === endHour && minute > endMinute) break;

      // Skip jika jam slot melebihi jam tutup
      if (hour > endHour) break;

      // Create slot time in booking date
      const slotStart = new Date(bookingDate);
      slotStart.setHours(hour, minute, 0, 0);

      // Compare dengan current time dalam timezone yang sama
      if (slotStart < nowInTimezone) continue;

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
