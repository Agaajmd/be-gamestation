export function calculateMaximumDuration(
  bookingDate: string,
  startHour: number,
  startMinute: number,
  closeTime: Date | string | null,
): number {
  const bookingDateObj = new Date(bookingDate);
  const startDateTime = new Date(bookingDateObj);
  startDateTime.setUTCHours(startHour, startMinute, 0, 0);

  const closeDateTime = new Date(bookingDateObj);

  if (closeTime) {
    let closeHour = 23;
    let closeMinute = 59;

    // Parse closeTime whether it's a Date or string
    if (typeof closeTime === "string") {
      const parts = closeTime.split(":");
      if (parts.length >= 1) closeHour = parseInt(parts[0], 10);
      if (parts.length >= 2) closeMinute = parseInt(parts[1], 10);
    } else if (closeTime instanceof Date) {
      // PostgreSQL Time fields: use getUTCHours/getUTCMinutes
      closeHour = closeTime.getUTCHours();
      closeMinute = closeTime.getUTCMinutes();
    }

    closeDateTime.setUTCHours(closeHour, closeMinute, 0, 0);
  } else {
    closeDateTime.setUTCHours(23, 59, 59, 0);
  }

  const maxDurationMs = closeDateTime.getTime() - startDateTime.getTime();
  const maxDurationMinutes = Math.floor(maxDurationMs / (1000 * 60));

  return maxDurationMinutes;
}
