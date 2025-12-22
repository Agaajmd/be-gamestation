/**
 * Helper function to format time as HH:MM:SS
 */
export const formatTime = (date: Date | null): string | null => {
  if (!date) return null;
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};