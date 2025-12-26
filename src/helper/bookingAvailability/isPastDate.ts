/**
 * Check if date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dateStr = date.toISOString().split('T')[0];
  
  return dateStr < todayStr;
};