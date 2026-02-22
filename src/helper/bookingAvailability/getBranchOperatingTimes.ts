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

export const getBranchOperatingTimes = (
  openTime: Date | string | null,
  closeTime: Date | string | null,
) => {
  const openTimeData = extractTimeFromValue(openTime) ?? {
    hours: 9,
    minutes: 0,
  };
  const closeTimeData = extractTimeFromValue(closeTime) ?? {
    hours: 23,
    minutes: 0,
  };

  const openHour = openTimeData.hours;
  const openMinute = openTimeData.minutes;
  const closeHour = closeTimeData.hours;
  const closeMinute = closeTimeData.minutes;

  // Calculate total hours (consider minutes too)
  const totalMinutes =
    closeHour * 60 + closeMinute - (openHour * 60 + openMinute);
  const totalHours = Math.floor(totalMinutes / 60);

  return {
    openHour,
    openMinute,
    closeHour,
    closeMinute,
    totalHours,
    totalMinutes,
  };
};
