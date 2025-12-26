/**
 * Fetch all bookings and exceptions for a month
 */
export declare const fetchMonthlyData: (branchId: bigint, deviceIds: bigint[], startDate: Date, endDate: Date) => Promise<[{
    bookingStart: Date;
    bookingEnd: Date;
    orderItems: {
        roomAndDeviceId: bigint;
    }[];
}[], {
    roomAndDeviceId: bigint;
    startAt: Date;
    endAt: Date;
    reason: string | null;
}[]]>;
//# sourceMappingURL=fetchMonthlyData.d.ts.map