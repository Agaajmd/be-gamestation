"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranchHoliday = exports.getBranchHolidays = exports.addCustomHolidaysBulk = exports.addCustomHoliday = exports.syncNationalHolidays = void 0;
// Services
const holidayService_1 = require("../service/HolidayService/holidayService");
// Error
const responseHelper_1 = require("../helper/responseHelper");
/**
 * Helper function to serialize holiday data
 */
const serializeHoliday = (holiday) => {
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
const syncNationalHolidays = async (req, res) => {
    try {
        const { year } = req.params;
        const { branchIds, overwrite, deleteExisting } = req.query;
        const yearNum = parseInt(year);
        // Parse branchIds if provided
        let branchIdArray;
        if (branchIds && typeof branchIds === "string") {
            branchIdArray = branchIds.split(",").map((id) => id.trim());
        }
        // Parse boolean flags
        const overwriteFlag = overwrite === "true";
        const deleteExistingFlag = deleteExisting === "true";
        const result = await (0, holidayService_1.syncNationalHolidaysService)({
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
    }
    catch (error) {
        if (error instanceof Error && error.name === "FetchError") {
            return (0, responseHelper_1.handleError)({
                message: "Tidak dapat terhubung ke API eksternal. Cek koneksi internet.",
            }, res);
        }
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.syncNationalHolidays = syncNationalHolidays;
/**
 * POST /holidays/custom
 * Menambahkan hari libur custom untuk branch tertentu atau semua branch
 * Body: branchIds (optional, comma-separated in query), date, name, description (optional), overwrite (boolean)
 */
const addCustomHoliday = async (req, res) => {
    try {
        const { branchIds, overwrite } = req.query;
        const { date, name, description } = req.body;
        // Parse branchIds if provided
        let branchIdArray;
        if (branchIds && typeof branchIds === "string") {
            branchIdArray = branchIds.split(",").map((id) => id.trim());
        }
        const overwriteFlag = overwrite === "true";
        const result = await (0, holidayService_1.addCustomHolidayService)({
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
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.addCustomHoliday = addCustomHoliday;
/**
 * POST /holidays/custom/bulk
 * Menambahkan multiple hari libur custom
 * Body: branchIds (optional), holidays (array of {date, name, description}), overwrite (boolean)
 */
const addCustomHolidaysBulk = async (req, res) => {
    try {
        const { branchIds, overwrite } = req.query;
        const { holidays } = req.body;
        // Parse branchIds if provided
        let branchIdArray;
        if (branchIds && typeof branchIds === "string") {
            branchIdArray = branchIds.split(",").map((id) => id.trim());
        }
        const overwriteFlag = overwrite === "true";
        const result = await (0, holidayService_1.addCustomHolidaysService)({
            branchIds: branchIdArray,
            holidays,
            overwrite: overwriteFlag,
        });
        res.status(201).json({
            success: true,
            message: `Berhasil menambahkan ${result.created} hari libur baru`,
            data: result,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.addCustomHolidaysBulk = addCustomHolidaysBulk;
/**
 * GET /branches/:branchId/holidays
 * Mendapatkan semua hari libur untuk branch
 */
const getBranchHolidays = async (req, res) => {
    try {
        const branchId = BigInt(req.params.branchId);
        const { startDate, endDate } = req.query;
        const holidays = await (0, holidayService_1.getBranchHolidaysService)({
            branchId,
            startDate: startDate,
            endDate: endDate,
        });
        const serialized = holidays.map(serializeHoliday);
        res.status(200).json({
            success: true,
            data: serialized,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getBranchHolidays = getBranchHolidays;
/**
 * DELETE /holidays/:holidayId
 * Menghapus hari libur spesifik
 * Jika :holidayId adalah "delete-range", gunakan query params untuk delete by date range
 */
const deleteBranchHoliday = async (req, res) => {
    try {
        const { holidayId } = req.params;
        const { branchIds, startDate, endDate } = req.query;
        // Check if this is a delete-range request
        if (holidayId === "delete-range") {
            if (!startDate || !endDate) {
                return (0, responseHelper_1.handleError)({ message: "startDate dan endDate harus diisi" }, res);
            }
            // Parse branchIds if provided
            let branchIdArray;
            if (branchIds && typeof branchIds === "string") {
                branchIdArray = branchIds.split(",").map((id) => id.trim());
            }
            const result = await (0, holidayService_1.deleteBranchHolidayService)({
                branchIds: branchIdArray,
                startDate: startDate,
                endDate: endDate,
            });
            res.status(200).json({
                success: true,
                message: `Berhasil menghapus ${result.deletedCount} hari libur`,
                data: result,
            });
        }
        else {
            // Delete specific holiday by ID
            const holidayIdBigInt = BigInt(holidayId);
            const result = await (0, holidayService_1.deleteBranchHolidayService)({
                holidayId: holidayIdBigInt,
            });
            res.status(200).json({
                success: true,
                message: "Hari libur berhasil dihapus",
                data: result,
            });
        }
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.deleteBranchHoliday = deleteBranchHoliday;
/**
 * Endpoint ini dihapus karena sudah dihandle di deleteBranchHoliday dengan conditional
 */
// Sebelumnya: DELETE /holidays/delete-range
// Sekarang: DELETE /holidays/delete-range (via deleteBranchHoliday)
//# sourceMappingURL=HolidayController.js.map