export function calculateMaximumDuration(
  bookingDate: string,
  startHour: number,
  startMinute: number,
  closeTime: Date | null,
): number {
  const bookingDateObj = new Date(bookingDate);
  const startDateTime = new Date(bookingDateObj);
  startDateTime.setUTCHours(startHour, startMinute, 0, 0);

  const closeDateTime = new Date(bookingDateObj);

  if (closeTime) {
    const closeDate = new Date(closeTime);
    const closeHour = closeDate.getUTCHours();
    const closeMinute = closeDate.getUTCMinutes();
    closeDateTime.setUTCHours(closeHour, closeMinute, 0, 0);
  } else {
    closeDateTime.setUTCHours(23, 59, 59, 0);
  }

  const maxDurationMs = closeDateTime.getTime() - startDateTime.getTime();
  const maxDurationMinutes = Math.floor(maxDurationMs / (1000 * 60));

  return maxDurationMinutes;
}
