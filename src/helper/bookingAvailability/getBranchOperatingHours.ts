/**
 * Parse time value (Date or ISO string) and extract hours
 */
const extractHourFromTime = (time: Date | string | null): number | null => {
  if (!time) return null;

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

  return null;
};

/**
 * Get branch operating hours
 */
export const getBranchOperatingHours = (
  openTime: Date | string | null,
  closeTime: Date | string | null,
) => {
  const openHour = extractHourFromTime(openTime) ?? 9;
  const closeHour = extractHourFromTime(closeTime) ?? 23;

  return { openHour, closeHour, totalHours: closeHour - openHour };
};
