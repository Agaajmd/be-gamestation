/**
 * Get branch operating hours
 */
export const getBranchOperatingHours = (
  openTime: Date | null,
  closeTime: Date | null
) => {
  const openHour = openTime ? new Date(openTime).getUTCHours() : 9;
  const closeHour = closeTime ? new Date(closeTime).getUTCHours() : 23;
  
  return { openHour, closeHour, totalHours: closeHour - openHour };
};