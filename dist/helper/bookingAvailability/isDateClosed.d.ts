/**
 * Check if all devices are closed (have full-day exceptions) on a date
 */
export declare const isDateClosed: (currentDate: Date, openHour: number, closeHour: number, exceptions: Array<{
    roomAndDeviceId: bigint;
    startAt: Date;
    endAt: Date;
}>, totalDevices: number) => boolean;
//# sourceMappingURL=isDateClosed.d.ts.map