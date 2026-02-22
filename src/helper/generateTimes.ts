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

export function generateTimeSlots(
  bookingDate: string,
  branch: Branch,
  devices: Device[],
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();

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
