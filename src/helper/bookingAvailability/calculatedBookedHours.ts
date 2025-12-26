/**
 * Calculate booked hours for a device on a specific date
 */
export const calculateBookedHours = (
  orders: Array<{ bookingStart: Date; bookingEnd: Date }>,
  date: Date,
  openHour: number,
  closeHour: number
): number => {
  let bookedHours = 0;

  orders.forEach((order) => {
    const start = new Date(
      Math.max(
        order.bookingStart.getTime(),
        new Date(date).setHours(openHour, 0, 0, 0)
      )
    );
    const end = new Date(
      Math.min(
        order.bookingEnd.getTime(),
        new Date(date).setHours(closeHour, 0, 0, 0)
      )
    );
    bookedHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  });

  return bookedHours;
};