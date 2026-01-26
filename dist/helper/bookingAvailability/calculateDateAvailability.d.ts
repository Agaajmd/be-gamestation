/**
 * Calculate availability for a single date
 */
export declare const calculateDateAvailability: (currentDate: Date, devices: Array<{
    id: bigint;
}>, orders: Array<{
    orderItems: Array<{
        roomAndDeviceId: bigint;
        bookingStart: Date;
        bookingEnd: Date;
    }>;
}>, exceptions: Array<{
    roomAndDeviceId: bigint;
    startAt: Date;
    endAt: Date;
}>, totalOperatingHours: number, openHour: number, closeHour: number) => {
    availableDevices: number;
    bookedDevices: number;
};
//# sourceMappingURL=calculateDateAvailability.d.ts.map