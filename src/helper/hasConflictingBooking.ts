const BUFFER_MINUTES = 10;

export const hasConflictingBooking = (
  orderItems: Array<{
    bookingStart: Date;
    bookingEnd: Date;
  }>,
  targetStart: Date,
  targetEnd: Date
): boolean => {
  return orderItems.some(item => {
    const bookingStart = item.bookingStart;
    const bookingEnd = new Date(item.bookingEnd);

    bookingEnd.setMinutes(bookingEnd.getMinutes() + BUFFER_MINUTES);

    return targetStart < bookingEnd && targetEnd > bookingStart;
  });
};
