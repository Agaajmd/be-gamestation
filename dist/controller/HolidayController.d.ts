import { Request, Response } from "express";
/**
 * POST /holidays/national/sync/:year
 * Sync libur nasional Indonesia dari API eksternal (api-harilibur.vercel.app)
 * Query params: branchIds (comma-separated), overwrite (boolean), deleteExisting (boolean)
 */
export declare const syncNationalHolidays: (req: Request, res: Response) => Promise<void>;
/**
 * POST /holidays/custom
 * Menambahkan hari libur custom untuk branch tertentu atau semua branch
 * Body: branchIds (optional, comma-separated in query), date, name, description (optional), overwrite (boolean)
 */
export declare const addCustomHoliday: (req: Request, res: Response) => Promise<void>;
/**
 * POST /holidays/custom/bulk
 * Menambahkan multiple hari libur custom
 * Body: branchIds (optional), holidays (array of {date, name, description}), overwrite (boolean)
 */
export declare const addCustomHolidaysBulk: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:branchId/holidays
 * Mendapatkan semua hari libur untuk branch
 */
export declare const getBranchHolidays: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /holidays/:holidayId
 * Menghapus hari libur spesifik
 * Jika :holidayId adalah "delete-range", gunakan query params untuk delete by date range
 */
export declare const deleteBranchHoliday: (req: Request, res: Response) => Promise<void>;
/**
 * Endpoint ini dihapus karena sudah dihandle di deleteBranchHoliday dengan conditional
 */
//# sourceMappingURL=HolidayController.d.ts.map