interface SyncNationalHolidaysPayload {
    branchIds?: string[];
    year: number;
    overwrite?: boolean;
    deleteExisting?: boolean;
}
interface AddCustomHolidayPayload {
    branchIds?: string[];
    date: string;
    name: string;
    description?: string;
    overwrite?: boolean;
}
interface AddCustomHolidaysPayload {
    branchIds?: string[];
    holidays: Array<{
        date: string;
        name: string;
        description?: string;
    }>;
    overwrite?: boolean;
}
interface DeleteBranchHolidayPayload {
    branchIds?: string[];
    holidayId?: bigint;
    startDate?: string;
    endDate?: string;
}
interface GetBranchHolidaysPayload {
    branchId: bigint;
    startDate?: string;
    endDate?: string;
}
export declare function syncNationalHolidaysService(payload: SyncNationalHolidaysPayload): Promise<{
    year: number;
    targetBranches: number;
    totalFromAPI: number;
    created: number;
    updated: number;
    skipped: number;
    deleted: number;
    failed: number;
    createdList: {
        date: any;
        name: any;
        branchCount: number;
    }[];
    updatedList: {
        date: any;
        name: any;
        branchCount: number;
    }[] | undefined;
    skippedList: {
        date: any;
        name: any;
        reason: string;
        branchCount: number;
    }[] | undefined;
    deletedList: {
        date: any;
        name: any;
        branchCount: number;
    }[] | undefined;
    errorList: {
        date: any;
        name: any;
        error: any;
    }[] | undefined;
}>;
export declare function addCustomHolidayService(payload: AddCustomHolidayPayload): Promise<{
    date: string;
    name: string;
    targetBranches: number;
    created: number;
    updated: number;
    skipped: number;
    failed: number;
    createdList: {
        id: string;
        branchId: bigint;
        branchName: string;
        date: string;
        name: string;
    }[] | undefined;
    updatedList: {
        id: string;
        branchId: bigint;
        branchName: string;
        date: string;
        name: string;
    }[] | undefined;
    skippedList: {
        branchId: bigint;
        branchName: string;
        date: string;
        name: string;
        reason: string;
    }[] | undefined;
    errorList: {
        branchId: bigint;
        branchName: string;
        error: any;
    }[] | undefined;
}>;
export declare function addCustomHolidaysService(payload: AddCustomHolidaysPayload): Promise<{
    created: number;
    updated: number;
    skipped: number;
    failed: number;
    createdList: any[];
    updatedList: any[];
    skippedList: any[];
    errorList: any[];
    totalHolidays: number;
    targetBranches: number;
}>;
export declare function getBranchHolidaysService(payload: GetBranchHolidaysPayload): Promise<{
    name: string;
    id: bigint;
    createdAt: Date;
    branchId: bigint;
    description: string | null;
    date: Date;
}[]>;
export declare function deleteBranchHolidayService(payload: DeleteBranchHolidayPayload): Promise<{
    deletedCount: number;
    holidayId: string;
    branchId: bigint;
    startDate?: undefined;
    endDate?: undefined;
    affectedBranches?: undefined;
} | {
    deletedCount: number;
    startDate: string | undefined;
    endDate: string | undefined;
    affectedBranches: number;
    holidayId?: undefined;
    branchId?: undefined;
}>;
export {};
//# sourceMappingURL=holidayService.d.ts.map