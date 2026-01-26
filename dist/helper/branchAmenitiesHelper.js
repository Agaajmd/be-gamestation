"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FACILITIES_OPTIONS = exports.getAmenitiesSummary = exports.updateBranchFacilities = exports.updateBranchAmenities = void 0;
const database_1 = require("../database");
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
const updateBranchAmenities = async (branchId, preserveFacilities = true) => {
    try {
        // Get current branch data
        const branch = await database_1.prisma.branch.findUnique({
            where: { id: branchId },
            select: { amenities: true },
        });
        // Get all active devices
        const roomAndDevices = await database_1.prisma.roomAndDevice.findMany({
            where: { branchId, status: "available" },
            select: {
                deviceType: true,
                version: true,
            },
        });
        // Get all active device categories
        const categories = await database_1.prisma.category.findMany({
            where: { branchId },
            select: {
                name: true,
                tier: true,
            },
        });
        // Preserve existing facilities if requested
        let facilities = {
            general: [],
            foodAndBeverage: [],
            parking: [],
            entertainment: [],
            accessibility: [],
        };
        if (preserveFacilities && branch?.amenities) {
            const existingAmenities = branch.amenities;
            if (existingAmenities.facilities) {
                facilities = {
                    general: existingAmenities.facilities.general || [],
                    foodAndBeverage: existingAmenities.facilities.foodAndBeverage || [],
                    parking: existingAmenities.facilities.parking || [],
                    entertainment: existingAmenities.facilities.entertainment || [],
                    accessibility: existingAmenities.facilities.accessibility || [],
                };
            }
        }
        // Build amenities object
        const amenities = {
            auto: {
                roomAndDevices: {
                    types: [...new Set(roomAndDevices.map((d) => d.deviceType))].sort(),
                    versions: [
                        ...new Set(roomAndDevices
                            .map((d) => d.version)
                            .filter((v) => v !== null && v !== undefined)),
                    ].sort(),
                    total: roomAndDevices.length,
                },
                categories: {
                    tiers: [...new Set(categories.map((c) => c.tier))].sort(),
                    names: [...new Set(categories.map((c) => c.name))].sort(),
                    total: categories.length,
                },
            },
            facilities,
            lastUpdated: new Date().toISOString(),
        };
        // Update branch amenities
        await database_1.prisma.branch.update({
            where: { id: branchId },
            data: { amenities: amenities },
        });
        console.log(`[AMENITIES] Updated for branch ${branchId}: ${amenities.auto.roomAndDevices.total} devices, ${amenities.auto.categories.total} categories`);
        return amenities;
    }
    catch (error) {
        console.error("Update branch amenities error:", error);
        throw error;
    }
};
exports.updateBranchAmenities = updateBranchAmenities;
/**
 * Update manual facilities untuk branch
 * Tidak mengubah auto-generated data
 *
 * @param branchId - ID branch yang akan diupdate
 * @param facilities - Facilities object yang baru
 * @returns Updated amenities object
 */
const updateBranchFacilities = async (branchId, facilities) => {
    try {
        // Get current amenities
        const branch = await database_1.prisma.branch.findUnique({
            where: { id: branchId },
            select: { amenities: true },
        });
        if (!branch) {
            throw new Error("Branch not found");
        }
        const currentAmenities = branch.amenities || {
            auto: {
                roomAndDevices: { types: [], versions: [], total: 0 },
                categories: { tiers: [], names: [], total: 0 },
            },
        };
        // Update facilities, preserve auto data
        const updatedAmenities = {
            auto: currentAmenities.auto,
            facilities: {
                general: facilities.general || [],
                foodAndBeverage: facilities.foodAndBeverage || [],
                parking: facilities.parking || [],
                entertainment: facilities.entertainment || [],
                accessibility: facilities.accessibility || [],
            },
            lastUpdated: new Date().toISOString(),
        };
        // Update branch
        await database_1.prisma.branch.update({
            where: { id: branchId },
            data: { amenities: updatedAmenities },
        });
        console.log(`[AMENITIES] Updated facilities for branch ${branchId}`);
        return updatedAmenities;
    }
    catch (error) {
        console.error("Update branch facilities error:", error);
        throw error;
    }
};
exports.updateBranchFacilities = updateBranchFacilities;
/**
 * Get formatted amenities summary for display
 */
const getAmenitiesSummary = (amenities) => {
    const summary = [];
    // Auto-generated
    if (amenities.auto) {
        // Device types
        if (amenities.auto.roomAndDevices.total > 0) {
            summary.push(`${amenities.auto.roomAndDevices.total} devices (${amenities.auto.roomAndDevices.types.join(", ")})`);
        }
        // Categories
        if (amenities.auto.categories.total > 0) {
            summary.push(`${amenities.auto.categories.total} categories (${amenities.auto.categories.tiers.join(", ")})`);
        }
    }
    // Facilities
    if (amenities.facilities) {
        const allFacilities = [
            ...amenities.facilities.general,
            ...amenities.facilities.foodAndBeverage,
            ...amenities.facilities.parking,
            ...amenities.facilities.entertainment,
            ...amenities.facilities.accessibility,
        ];
        if (allFacilities.length > 0) {
            summary.push(`Facilities: ${allFacilities.join(", ")}`);
        }
    }
    return summary;
};
exports.getAmenitiesSummary = getAmenitiesSummary;
/**
 * Predefined facilities options for frontend
 */
exports.FACILITIES_OPTIONS = {
    general: [
        "wifi",
        "ac",
        "toilet",
        "prayer_room",
        "smoking_area",
        "waiting_area",
        "locker",
        "cctv",
    ],
    foodAndBeverage: [
        "cafe",
        "canteen",
        "vending_machine",
        "water_dispenser",
        "microwave",
        "refrigerator",
    ],
    parking: [
        "car_parking",
        "motorcycle_parking",
        "bicycle_parking",
        "valet_parking",
    ],
    entertainment: [
        "tv",
        "music",
        "streaming",
        "karaoke",
        "board_games",
        "arcade",
    ],
    accessibility: [
        "wheelchair_access",
        "elevator",
        "ramp",
        "braille_signage",
        "disability_toilet",
    ],
};
//# sourceMappingURL=branchAmenitiesHelper.js.map