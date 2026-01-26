export declare const checkDeviceAvailability: (device: {
    availabilityExceptions: Array<{
        startAt: Date;
        endAt: Date;
    }>;
    orderItems: Array<{
        bookingStart: Date;
        bookingEnd: Date;
    }>;
}, targetStart: Date, targetEnd: Date) => {
    isAvailable: boolean;
    unavailableReason: string | null;
};
//# sourceMappingURL=checkDeviceAvailability.d.ts.map