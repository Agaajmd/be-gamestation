export interface TimeSlot {
    time: string;
    availableDeviceCount: number;
    isAvailable: boolean;
}
interface Branch {
    openTime?: string;
    closeTime?: string;
}
interface Device {
    availabilityExceptions: Array<{
        startAt: Date;
        endAt: Date;
    }>;
    orderItems: Array<{
        bookingStart: Date;
        bookingEnd: Date;
    }>;
}
export declare function generateTimeSlots(bookingDate: string, branch: Branch, devices: Device[]): TimeSlot[];
export {};
//# sourceMappingURL=generateTimes.d.ts.map