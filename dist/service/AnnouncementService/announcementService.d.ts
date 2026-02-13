/**
 * Create announcement
 */
export declare const createAnnouncementService: (payload: {
    title: string;
    content: string;
    forBranch: bigint | null;
    startDate: string;
    endDate: string;
}) => Promise<{
    id: any;
    title: any;
    content: any;
    forBranch: any;
    startDate: any;
    endDate: any;
    createdAt: any;
    updatedAt: any;
}>;
/**
 * Get all announcements with pagination
 */
export declare const getAnnouncementsService: (payload: {
    skip?: number;
    take?: number;
    branchId?: string | number | null;
}) => Promise<{
    announcements: {
        id: any;
        title: any;
        content: any;
        forBranch: any;
        startDate: any;
        endDate: any;
        createdAt: any;
        updatedAt: any;
    }[];
    total: number;
    skip: number;
    take: number;
}>;
/**
 * Get active announcements only
 */
export declare const getActiveAnnouncementsService: (payload: {
    skip?: number;
    take?: number;
    branchId?: string | number | null;
}) => Promise<{
    announcements: {
        id: any;
        title: any;
        content: any;
        forBranch: any;
        startDate: any;
        endDate: any;
        createdAt: any;
        updatedAt: any;
    }[];
    total: number;
    skip: number;
    take: number;
}>;
/**
 * Get announcement by ID
 */
export declare const getAnnouncementByIdService: (id: string | number) => Promise<{
    id: any;
    title: any;
    content: any;
    forBranch: any;
    startDate: any;
    endDate: any;
    createdAt: any;
    updatedAt: any;
}>;
/**
 * Update announcement
 */
export declare const updateAnnouncementService: (payload: {
    id: string | number;
    title?: string;
    content?: string;
    forBranch?: string | number | null;
    startDate?: string;
    endDate?: string;
}) => Promise<{
    id: any;
    title: any;
    content: any;
    forBranch: any;
    startDate: any;
    endDate: any;
    createdAt: any;
    updatedAt: any;
}>;
/**
 * Delete announcement
 */
export declare const deleteAnnouncementService: (id: string | number) => Promise<{
    message: string;
    id: bigint;
}>;
//# sourceMappingURL=announcementService.d.ts.map