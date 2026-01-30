import { prisma } from "../database";

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
export const updateBranchAmenities = async (
  branchId: bigint,
  preserveFacilities: boolean = true
): Promise<BranchAmenities> => {
  try {
    // Get current branch data
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: { amenities: true },
    });

    // Get all active devices
    const roomAndDevices = await prisma.roomAndDevice.findMany({
      where: { branchId, status: "available" },
      select: {
        deviceType: true,
        version: true,
      },
    });

    // Get all active device categories
    const categories = await prisma.category.findMany({
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
      const existingAmenities = branch.amenities as any;
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
    const amenities: BranchAmenities = {
      auto: {
        roomAndDevices: {
          types: [...new Set(roomAndDevices.map((d) => d.deviceType))].sort(),
          versions: [
            ...new Set(
              roomAndDevices
                .map((d) => d.version)
                .filter((v) => v !== null && v !== undefined) as string[]
            ),
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
    await prisma.branch.update({
      where: { id: branchId },
      data: { amenities: amenities as any },
    });

    return amenities;
  } catch (error) {
    console.error("Update branch amenities error:", error);
    throw error;
  }
};

/**
 * Update manual facilities untuk branch
 * Tidak mengubah auto-generated data
 *
 * @param branchId - ID branch yang akan diupdate
 * @param facilities - Facilities object yang baru
 * @returns Updated amenities object
 */
export const updateBranchFacilities = async (
  branchId: bigint,
  facilities: BranchAmenities["facilities"]
): Promise<BranchAmenities> => {
  try {
    // Get current amenities
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: { amenities: true },
    });

    if (!branch) {
      throw new Error("Branch not found");
    }

    const currentAmenities = (branch.amenities as any) || {
      auto: {
        roomAndDevices: { types: [], versions: [], total: 0 },
        categories: { tiers: [], names: [], total: 0 },
      },
    };

    // Update facilities, preserve auto data
    const updatedAmenities: BranchAmenities = {
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
    await prisma.branch.update({
      where: { id: branchId },
      data: { amenities: updatedAmenities as any },
    });

    return updatedAmenities;
  } catch (error) {
    console.error("Update branch facilities error:", error);
    throw error;
  }
};

/**
 * Get formatted amenities summary for display
 */
export const getAmenitiesSummary = (amenities: BranchAmenities): string[] => {
  const summary: string[] = [];

  // Auto-generated
  if (amenities.auto) {
    // Device types
    if (amenities.auto.roomAndDevices.total > 0) {
      summary.push(
        `${
          amenities.auto.roomAndDevices.total
        } devices (${amenities.auto.roomAndDevices.types.join(", ")})`
      );
    }

    // Categories
    if (amenities.auto.categories.total > 0) {
      summary.push(
        `${
          amenities.auto.categories.total
        } categories (${amenities.auto.categories.tiers.join(", ")})`
      );
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

/**
 * Predefined facilities options for frontend
 */
export const FACILITIES_OPTIONS = {
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
