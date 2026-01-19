export function calculateMaximumDuration(
  bookingDate: string,
  startHour: number,
  startMinute: number,
  closeHour: number
): number {
  const bookingDateObj = new Date(bookingDate);
  const startDateTime = new Date(bookingDateObj);
  startDateTime.setHours(startHour, startMinute, 0, 0);

  const closeDateTime = new Date(bookingDateObj);
  closeDateTime.setHours(closeHour, 0, 0, 0);

  const maxDurationMs = closeDateTime.getTime() - startDateTime.getTime();
  const maxDurationMinutes = Math.floor(maxDurationMs / (1000 * 60));

  return maxDurationMinutes;
}
