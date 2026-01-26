/**
 * Fetch all bookings and exceptions for a month
 */
export declare const fetchMonthlyData: (branchId: bigint, deviceIds: bigint[], startDate: Date, endDate: Date) => Promise<[{
    orderItems: {
        roomAndDeviceId: bigint;
        bookingStart: Date;
        bookingEnd: Date;
    }[];
}[], {
    roomAndDeviceId: bigint;
    startAt: Date;
    endAt: Date;
    reason: string | null;
}[], {
    name: string;
    branchId: bigint;
    description: string | null;
    date: Date;
}[]]>;
//# sourceMappingURL=fetchMonthlyData.d.ts.map