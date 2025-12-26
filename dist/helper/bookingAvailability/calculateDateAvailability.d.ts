/**
 * Calculate availability for a single date
 */
export declare const calculateDateAvailability: (currentDate: Date, devices: Array<{
    id: bigint;
}>, orders: Array<{
    bookingStart: Date;
    bookingEnd: Date;
    orderItems: Array<{
        roomAndDeviceId: bigint;
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