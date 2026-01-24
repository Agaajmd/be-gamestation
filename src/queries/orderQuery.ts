import { OrderItemRepository } from "../repository/orderItemRepository";
import { OrderStatus } from "@prisma/client";

export const OrderQuery = {
  async findDuplicateOrder(
    roomAndDeviceId: bigint,
    branchId: bigint,
    customerId: bigint,
    bookingStart: Date,
    bookingEnd: Date,
  ) {
    return OrderItemRepository.findFirst({
      roomAndDeviceId,
      order: {
        branchId,
        customerId,
        status: {
          in: [OrderStatus.pending, OrderStatus.confirmed, OrderStatus.cart],
        },
      },
      OR: [
        {
          AND: [
            { bookingStart: { lte: bookingStart } },
            { bookingEnd: { gt: bookingStart } },
          ],
        },
        {
          AND: [
            { bookingStart: { lt: bookingEnd } },
            { bookingEnd: { gte: bookingEnd } },
          ],
        },
        {
          AND: [
            { bookingStart: { gte: bookingStart } },
            { bookingEnd: { lte: bookingEnd } },
          ],
        },
      ],
    });
  },
};
