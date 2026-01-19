export const isUnavailableAtTime = (
  exceptions: Array<{ startAt: Date; endAt: Date }>,
  targetStart: Date,
): boolean => {
  return exceptions.some(
    (exc) => targetStart >= exc.startAt && targetStart < exc.endAt,
  );
};
