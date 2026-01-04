/**
 * Calculate booked hours for a device on a specific date
 */
export const calculateBookedHours = (
  orders: Array<{
    orderItems: Array<{
      bookingStart: Date;
      bookingEnd: Date;
    }>;
  }>,
  date: Date,
  openHour: number,
  closeHour: number
): number => {
  let bookedHours = 0;

  const dayOpen = new Date(date);
  dayOpen.setHours(openHour, 0, 0, 0);

  const dayClose = new Date(date);
  dayClose.setHours(closeHour, 0, 0, 0);

  orders.forEach((order) => {
    order.orderItems.forEach((item) => {
      const start = new Date(
        Math.max(item.bookingStart.getTime(), dayOpen.getTime())
      );

      const end = new Date(
        Math.min(item.bookingEnd.getTime(), dayClose.getTime())
      );

      // only count if valid overlap
      if (end > start) {
        bookedHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }
    });
  });

  return bookedHours;
};
