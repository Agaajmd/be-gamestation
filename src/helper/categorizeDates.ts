import { isPastDate } from "./bookingAvailability/isPastDate";
import { isDateClosed } from "./bookingAvailability/isDateClosed";
import { calculateDateAvailability } from "./bookingAvailability/calculateDateAvailability";

export function categorizeDates(
  startDate: Date,
  endDate: Date,
  devices: any[],
  orders: any[],
  openHour: number,
  closeHour: number,
  totalHours: number,
  exceptions: any[],
  holidays: Date[]
): {
  availableDates: string[];
  fullyBookedDates: string[];
  closedDates: string[];
} {
  const holidayDates = new Set(
    holidays.map((date) => date.toISOString().split("T")[0])
  );

  const availableDates: string[] = [];
  const fullyBookedDates: string[] = [];
  const closedDates: string[] = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
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

  return { availableDates, fullyBookedDates, closedDates };
}
