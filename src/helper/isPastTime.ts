/**
 * Check if time is in the past
 */
export const isPastTime = (bookingStart: Date, bookingDate: Date): boolean => {
  const now = new Date();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = bookingDate.getTime() === today.getTime();

  return isToday && bookingStart <= now;
};
