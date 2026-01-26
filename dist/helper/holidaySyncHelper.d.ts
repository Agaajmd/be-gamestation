export interface HolidayData {
    holiday_date: string | Date;
    holiday_name: string;
    description?: string;
}
export interface SyncHolidaysOptions {
    branchIds?: string[];
    holidays: HolidayData[];
    overwrite?: boolean;
    deleteExisting?: boolean;
}
export interface SyncHolidaysResult {
    createdHolidays: Array<{
        date: string;
        name: string;
        branchCount: number;
    }>;
    updatedHolidays: Array<{
        date: string;
        name: string;
        branchCount: number;
    }>;
    skippedHolidays: Array<{
        date: string;
        name: string;
        reason: string;
    }>;
    deletedHolidays: Array<{
        date: string;
        name: string;
        branchCount: number;
    }>;
    errors: Array<{
        date: string;
        name: string;
        error: string;
    }>;
    summary: {
        totalCreated: number;
        totalUpdated: number;
        totalSkipped: number;
        totalDeleted: number;
        totalErrors: number;
        branchesAffected: number;
    };
}
export declare class HolidaySyncHelper {
    /**
     * Sync holidays to branches
     */
    static syncHolidays(options: SyncHolidaysOptions): Promise<SyncHolidaysResult>;
    /**
     * Get target branches based on branchIds
     */
    private static getTargetBranches;
    /**
     * Delete existing holidays
     */
    private static deleteExistingHolidays;
    /**
     * Get holiday type label
     */
    private static getHolidayTypeLabel;
    /**
     * Sync national holidays to all or specific branches
     */
    static syncNationalHolidays(nationalHolidays: HolidayData[], branchIds?: string[]): Promise<SyncHolidaysResult>;
    /**
     * Sync regional holidays to specific branches
     */
    static syncRegionalHolidays(regionalHolidays: HolidayData[], branchIds: string[]): Promise<SyncHolidaysResult>;
    /**
     * Bulk delete holidays by date range
     */
    static deleteHolidaysByDateRange(startDate: Date, endDate: Date, branchIds?: string[]): Promise<{
        deletedCount: number;
        startDate: string;
        endDate: string;
    }>;
    /**
     * Get holidays for branches
     */
    static getHolidaysByBranch(branchIds?: string[], startDate?: Date, endDate?: Date): Promise<({
        branch: {
            name: string;
            id: bigint;
        };
    } & {
        name: string;
        id: bigint;
        createdAt: Date;
        branchId: bigint;
        description: string | null;
        date: Date;
    })[]>;
}
//# sourceMappingURL=holidaySyncHelper.d.ts.map