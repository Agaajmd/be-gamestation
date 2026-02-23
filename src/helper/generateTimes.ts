export interface TimeSlot {
  time: string;
  availableDeviceCount: number;
  isAvailable: boolean;
}

interface Branch {
  openTime?: string | null;
  closeTime?: string | null;
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
  time: string | null,
): { hours: number; minutes: number } | null => {
  if (!time) return null;

  const parts = time.split(":");
  if (parts.length >= 1) {
    const hours = parseInt(parts[0], 10);
    const minutes = parts.length >= 2 ? parseInt(parts[1], 10) : 0;
    return { hours, minutes };
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

/**
 * Parse a date string (YYYY-MM-DD) sebagai midnight dalam timezone yang diberikan
 * Returns UTC equivalent dari local midnight
 */
const parseLocalDateInTimezone = (
  dateString: string,
  timezone: string,
): Date => {
  try {
    // Handle ISO format: ekstrak hanya tanggal (YYYY-MM-DD)
    const datePart = dateString.includes("T")
      ? dateString.split("T")[0]
      : dateString;

    const [year, month, day] = datePart.split("-").map(Number);

    // Buat date UTC midnight
    const utcMidnight = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

    // Convert ke local time dalam timezone
    const localMidnight = getLocalDateInTimezone(utcMidnight, timezone);

    // Hitung selisih jam antara UTC midnight dengan local midnight
    const offsetHours = localMidnight.getUTCHours() - 0;
    const offsetMinutes = localMidnight.getUTCMinutes() - 0;

    // UTC time untuk midnight dalam target timezone = UTC midnight - offset
    return new Date(
      utcMidnight.getTime() - (offsetHours * 60 + offsetMinutes) * 60000,
    );
  } catch (error) {
    return new Date(dateString);
  }
};

export function generateTimeSlots(
  bookingDate: string,
  branch: Branch,
  devices: Device[],
  timezone: string = "UTC",
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  const nowUTC = new Date();
  const nowLocal = getLocalDateInTimezone(nowUTC, timezone);

  const bookingDayStart = parseLocalDateInTimezone(bookingDate, timezone);

  const startTime = extractTimeFromValue(branch.openTime);
  const endTime = extractTimeFromValue(branch.closeTime);

  const startHour = startTime?.hours ?? 9;
  const startMinute = startTime?.minutes ?? 0;
  const endHour = endTime?.hours ?? 23;
  const endMinute = endTime?.minutes ?? 0;

  console.log("raw openTime:", branch.openTime);
  console.log("raw closeTime:", branch.closeTime);
  console.log("parsed endTime:", endTime);
  console.log("endHour:", endHour, "endMinute:", endMinute);

  const bookingDateStr = bookingDate.includes("T")
    ? bookingDate.split("T")[0]
    : bookingDate;
  const nowLocalDateStr = `${nowLocal.getUTCFullYear()}-${String(nowLocal.getUTCMonth() + 1).padStart(2, "0")}-${String(nowLocal.getUTCDate()).padStart(2, "0")}`;
  const isToday = bookingDateStr === nowLocalDateStr;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === endHour && minute >= endMinute) break;

      if (isToday) {
        const nowLocalHour = nowLocal.getUTCHours();
        const nowLocalMinute = nowLocal.getUTCMinutes();

        const nextSlotMinute = nowLocalMinute < 30 ? 30 : 60;
        const nextSlotHour =
          nowLocalMinute < 30 ? nowLocalHour : nowLocalHour + 1;

        const slotTotalMinutes = hour * 60 + minute;
        const nextSlotTotalMinutes =
          nextSlotHour * 60 + (nextSlotMinute === 60 ? 0 : nextSlotMinute);

        if (slotTotalMinutes < nextSlotTotalMinutes) continue;
      }

      const slotStart = new Date(
        bookingDayStart.getTime() + (hour * 60 + minute) * 60000,
      );

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
        time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
        availableDeviceCount,
        isAvailable: availableDeviceCount > 0,
      });
    }
  }

  return slots;
}
