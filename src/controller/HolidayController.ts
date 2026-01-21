import { Request, Response } from "express";

// Services
import {
  syncNationalHolidaysService,
  addCustomHolidayService,
  addCustomHolidaysService,
  getBranchHolidaysService,
  deleteBranchHolidayService,
} from "../service/HolidayService/holidayService";

// Error
import { handleError } from "../helper/responseHelper";

/**
 * Helper function to serialize holiday data
 */
const serializeHoliday = (holiday: any) => {
  return {
    ...holiday,
    id: holiday.id?.toString(),
    branchId: holiday.branchId?.toString(),
  };
};

/**
 * POST /holidays/national/sync/:year
 * Sync libur nasional Indonesia dari API eksternal (api-harilibur.vercel.app)
 * Query params: branchIds (comma-separated), overwrite (boolean), deleteExisting (boolean)
 */
export const syncNationalHolidays = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { year } = req.params;
    const { branchIds, overwrite, deleteExisting } = req.query;
    const yearNum = parseInt(year);

    // Parse branchIds if provided
    let branchIdArray: string[] | undefined;
    if (branchIds && typeof branchIds === "string") {
      branchIdArray = branchIds.split(",").map((id) => id.trim());
    }

    // Parse boolean flags
    const overwriteFlag = overwrite === "true";
    const deleteExistingFlag = deleteExisting === "true";

    const result = await syncNationalHolidaysService({
      year: yearNum,
      branchIds: branchIdArray,
      overwrite: overwriteFlag,
      deleteExisting: deleteExistingFlag,
    });

    res.status(201).json({
      success: true,
      message: `Berhasil sync ${result.created} libur nasional tahun ${yearNum}`,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "FetchError") {
      return handleError(
        {
          message:
            "Tidak dapat terhubung ke API eksternal. Cek koneksi internet.",
        },
        res,
      );
    }
    handleError(error, res);
  }
};

/**
 * POST /holidays/custom
 * Menambahkan hari libur custom untuk branch tertentu atau semua branch
 * Body: branchIds (optional, comma-separated in query), date, name, description (optional), overwrite (boolean)
 */
export const addCustomHoliday = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { branchIds, overwrite } = req.query;
    const { date, name, description } = req.body;

    // Parse branchIds if provided
    let branchIdArray: string[] | undefined;
    if (branchIds && typeof branchIds === "string") {
      branchIdArray = branchIds.split(",").map((id) => id.trim());
    }

    const overwriteFlag = overwrite === "true";

    const result = await addCustomHolidayService({
      branchIds: branchIdArray,
      date,
      name,
      description,
      overwrite: overwriteFlag,
    });

    res.status(201).json({
      success: true,
      message: `Hari libur '${name}' berhasil ditambahkan ke ${result.created} branch`,
      data: result,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * POST /holidays/custom/bulk
 * Menambahkan multiple hari libur custom
 * Body: branchIds (optional), holidays (array of {date, name, description}), overwrite (boolean)
 */
export const addCustomHolidaysBulk = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { branchIds, overwrite } = req.query;
    const { holidays } = req.body;

    // Parse branchIds if provided
    let branchIdArray: string[] | undefined;
    if (branchIds && typeof branchIds === "string") {
      branchIdArray = branchIds.split(",").map((id) => id.trim());
    }

    const overwriteFlag = overwrite === "true";

    const result = await addCustomHolidaysService({
      branchIds: branchIdArray,
      holidays,
      overwrite: overwriteFlag,
    });

    res.status(201).json({
      success: true,
      message: `Berhasil menambahkan ${result.created} hari libur baru`,
      data: result,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * GET /branches/:branchId/holidays
 * Mendapatkan semua hari libur untuk branch
 */
export const getBranchHolidays = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { startDate, endDate } = req.query;

    const holidays = await getBranchHolidaysService({
      branchId,
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
    });

    const serialized = holidays.map(serializeHoliday);

    res.status(200).json({
      success: true,
      data: serialized,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * DELETE /holidays/:holidayId
 * Menghapus hari libur spesifik
 * Jika :holidayId adalah "delete-range", gunakan query params untuk delete by date range
 */
export const deleteBranchHoliday = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { holidayId } = req.params;
    const { branchIds, startDate, endDate } = req.query;

    // Check if this is a delete-range request
    if (holidayId === "delete-range") {
      if (!startDate || !endDate) {
        return handleError(
          { message: "startDate dan endDate harus diisi" },
          res,
        );
      }

      // Parse branchIds if provided
      let branchIdArray: string[] | undefined;
      if (branchIds && typeof branchIds === "string") {
        branchIdArray = branchIds.split(",").map((id) => id.trim());
      }

      const result = await deleteBranchHolidayService({
        branchIds: branchIdArray,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json({
        success: true,
        message: `Berhasil menghapus ${result.deletedCount} hari libur`,
        data: result,
      });
    } else {
      // Delete specific holiday by ID
      const holidayIdBigInt = BigInt(holidayId);

      const result = await deleteBranchHolidayService({
        holidayId: holidayIdBigInt,
      });

      res.status(200).json({
        success: true,
        message: "Hari libur berhasil dihapus",
        data: result,
      });
    }
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Endpoint ini dihapus karena sudah dihandle di deleteBranchHoliday dengan conditional
 */
// Sebelumnya: DELETE /holidays/delete-range
// Sekarang: DELETE /holidays/delete-range (via deleteBranchHoliday)
