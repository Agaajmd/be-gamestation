import {
  bookingCartConfig,
  BookingCartWithRelations,
} from "../promise/bookingCart";
import { OrderRepository } from "../repository/orderRepository";

export const BookingCartQuery = {
  async findBookingCartByUserId(
    userId: bigint,
  ): Promise<BookingCartWithRelations> {
    const result = await OrderRepository.findFirst(
      { customerId: userId },
      bookingCartConfig,
    );
    return result as unknown as BookingCartWithRelations;
  },
};
