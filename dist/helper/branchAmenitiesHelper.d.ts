/**
 * Branch Amenities Structure
 * - auto: Auto-generated dari devices, categories, packages
 * - facilities: Manual input dari owner (cafe, parking, ac, dll)
 */
export interface BranchAmenities {
    auto: {
        roomAndDevices: {
            types: string[];
            versions: string[];
            total: number;
        };
        categories: {
            tiers: string[];
            names: string[];
            total: number;
        };
    };
    facilities: {
        general: string[];
        foodAndBeverage: string[];
        parking: string[];
        entertainment: string[];
        accessibility: string[];
    };
    lastUpdated: string;
}
/**
 * Auto-generate amenities untuk branch berdasarkan:
 * - Device types & versions yang tersedia
 * - Device categories (tiers & names)
 * - Packages yang tersedia
 *
 * @param branchId - ID branch yang akan diupdate
 * @param preserveFacilities - Apakah facilities yang sudah ada dipertahankan (default: true)
 * @returns Updated amenities object
 */
export declare const updateBranchAmenities: (branchId: bigint, preserveFacilities?: boolean) => Promise<BranchAmenities>;
/**
 * Update manual facilities untuk branch
 * Tidak mengubah auto-generated data
 *
 * @param branchId - ID branch yang akan diupdate
 * @param facilities - Facilities object yang baru
 * @returns Updated amenities object
 */
export declare const updateBranchFacilities: (branchId: bigint, facilities: BranchAmenities["facilities"]) => Promise<BranchAmenities>;
/**
 * Get formatted amenities summary for display
 */
export declare const getAmenitiesSummary: (amenities: BranchAmenities) => string[];
/**
 * Predefined facilities options for frontend
 */
export declare const FACILITIES_OPTIONS: {
    general: string[];
    foodAndBeverage: string[];
    parking: string[];
    entertainment: string[];
    accessibility: string[];
};
//# sourceMappingURL=branchAmenitiesHelper.d.ts.map