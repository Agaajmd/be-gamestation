const extractHourFromTime = (time: Date | string | null): number | null => {
  if (!time) return null;

  if (typeof time === "string") {
    const parts = time.split(":");
    if (parts.length >= 1) {
      return parseInt(parts[0], 10);
    }
  }

  if (time instanceof Date) {
    return time.getUTCHours();
  }

  return null;
};

export const getBranchOperatingHours = (
  openTime: Date | string | null,
  closeTime: Date | string | null,
) => {
  const openHour = extractHourFromTime(openTime) ?? 9;
  const closeHour = extractHourFromTime(closeTime) ?? 23;

  console.log("openHour: " , openHour);
  console.log("closeHour: " , closeHour);

  return { openHour, closeHour, totalHours: closeHour - openHour };
};
