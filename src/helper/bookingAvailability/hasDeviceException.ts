/**
 * Check if device has exception on specific date
 */
export const hasDeviceException = (
  deviceId: bigint,
  date: Date,
  exceptions: Array<{
    roomAndDeviceId: bigint;
    startAt: Date;
    endAt: Date;
  }>
): boolean => {
  const dayEnd = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  
  return exceptions.some((exc) => {
    if (exc.roomAndDeviceId !== deviceId) return false;
    const excStart = new Date(exc.startAt);
    const excEnd = new Date(exc.endAt);
    return excStart <= date && excEnd >= dayEnd;
  });
};