export interface TimeSlot {
  time: string;
  availableDeviceCount: number;
  isAvailable: boolean;
}

interface Branch {
  openTime?: string;
  closeTime?: string;
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

export function generateTimeSlots(
  bookingDate: string,
  branch: Branch,
  devices: Device[]
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();

  const startHour = branch.openTime
    ? new Date(branch.openTime).getUTCHours()
    : 9;
  const endHour = branch.closeTime
    ? new Date(branch.closeTime).getUTCHours()
    : 23;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slotStart = new Date(bookingDate);
      slotStart.setHours(hour, minute, 0, 0);

      if (slotStart < now) continue;

      let availableDeviceCount = 0;

      for (const device of devices) {
        let isAvailable = true;

        const hasException = device.availabilityExceptions.some(
          (exc) => slotStart >= exc.startAt && slotStart < exc.endAt
        );
        if (hasException) isAvailable = false;

        const hasBooking = device.orderItems.some(
          (item) =>
            slotStart >= item.bookingStart && slotStart < item.bookingEnd
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
