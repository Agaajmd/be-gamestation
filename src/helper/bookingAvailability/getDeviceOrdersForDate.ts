export const getDeviceOrdersForDate = (
  deviceId: bigint,
  date: Date,
  orders: Array<{
    orderItems: Array<{
      roomAndDeviceId: bigint;
      bookingStart: Date;
      bookingEnd: Date;
    }>;
  }>
) => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return orders.filter((order) => {
    order.orderItems.filter((item) => {
      if (item.roomAndDeviceId !== deviceId) return false;

      const start = new Date(item.bookingStart);
      const end = new Date(item.bookingEnd);

      return start <= dayEnd && end >= dayStart;
    })
  });
};
