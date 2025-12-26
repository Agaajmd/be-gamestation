export const getDeviceOrdersForDate = (
  deviceId: bigint,
  date: Date,
  orders: Array<{
    bookingStart: Date;
    bookingEnd: Date;
    orderItems: Array<{ roomAndDeviceId: bigint }>;
  }>
) => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return orders.filter((order) => {
    const hasDevice = order.orderItems.some(
      (item) => item.roomAndDeviceId === deviceId
    );
    if (!hasDevice) return false;

    const orderStart = new Date(order.bookingStart);
    const orderEnd = new Date(order.bookingEnd);
    return orderStart <= dayEnd && orderEnd >= dayStart;
  });
};