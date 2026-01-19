import { isUnavailableAtTime } from "./isUnavailableAtTime";
import { hasConflictingBooking } from "./hasConflictingBooking";

export const checkDeviceAvailability = (
  device: {
    availabilityExceptions: Array<{ startAt: Date; endAt: Date }>;
    orderItems: Array<{
      bookingStart: Date;
      bookingEnd: Date;
    }>;
  },
  targetStart: Date,
  targetEnd: Date
): {
  isAvailable: boolean;
  unavailableReason: string | null;
} => {
  if (isUnavailableAtTime(device.availabilityExceptions, targetStart)) {
    return {
      isAvailable: false,
      unavailableReason: "Under maintenance",
    };
  }

  if (
    hasConflictingBooking(
      device.orderItems,
      targetStart,
      targetEnd
    )
  ) {
    return {
      isAvailable: false,
      unavailableReason: "Already booked",
    };
  }

  return {
    isAvailable: true,
    unavailableReason: null,
  };
};
