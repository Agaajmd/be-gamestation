"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidaySyncHelper = void 0;
// lib/helpers/holiday-sync.helper.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class HolidaySyncHelper {
    /**
     * Sync holidays to branches
     */
    static async syncHolidays(options) {
        const { branchIds, holidays, overwrite = false, deleteExisting = false, } = options;
        const result = {
            createdHolidays: [],
            updatedHolidays: [],
            skippedHolidays: [],
            deletedHolidays: [],
            errors: [],
            summary: {
                totalCreated: 0,
                totalUpdated: 0,
                totalSkipped: 0,
                totalDeleted: 0,
                totalErrors: 0,
                branchesAffected: 0,
            },
        };
        try {
            result.summary.branchesAffected = branches.length;
            // Delete existing holidays if requested
            if (deleteExisting) {
                const deleted = await this.deleteExistingHolidays(branches, holidays);
                result.deletedHolidays = deleted;
                result.summary.totalDeleted = deleted.reduce((sum, h) => sum + h.branchCount, 0);
            }
            // Process each holiday
            for (const holiday of holidays) {
                try {
                    const holidayDate = new Date(holiday.holiday_date);
                    const holidayName = holiday.holiday_name;
                    const holidayType = holiday.holiday_type || 'custom';
                    const description = holiday.description ||
                        `${holidayName} - ${this.getHolidayTypeLabel(holidayType)}`;
                    // Check existing holidays
                    const existing = await prisma.branchHoliday.findMany({
                        where: {
                            branchId: { in: branches.map((b) => b.id) },
                            date: holidayDate,
                            name: holidayName,
                        },
                    });
                    const existingBranchIds = existing.map((h) => h.branchId);
                    const newBranchIds = branches
                        .filter((b) => !existingBranchIds.includes(b.id))
                        .map((b) => b.id);
                    // Update existing if overwrite is true
                    if (overwrite && existing.length > 0) {
                        await prisma.branchHoliday.updateMany({
                            where: {
                                branchId: { in: existingBranchIds },
                                date: holidayDate,
                                name: holidayName,
                            },
                            data: {
                                description: description,
                            },
                        });
                        result.updatedHolidays.push({
                            date: holidayDate.toISOString().split('T')[0],
                            name: holidayName,
                            branchCount: existing.length,
                        });
                        result.summary.totalUpdated += existing.length;
                    }
                    else if (existing.length > 0 && !overwrite) {
                        result.skippedHolidays.push({
                            date: holidayDate.toISOString().split('T')[0],
                            name: holidayName,
                            reason: `Already exists in ${existing.length} branch(es)`,
                        });
                        result.summary.totalSkipped += existing.length;
                    }
                    // Create new holidays
                    if (newBranchIds.length > 0) {
                        await prisma.branchHoliday.createMany({
                            data: newBranchIds.map((branchId) => ({
                                branchId,
                                date: holidayDate,
                                name: holidayName,
                                description: description,
                            })),
                        });
                        result.createdHolidays.push({
                            date: holidayDate.toISOString().split('T')[0],
                            name: holidayName,
                            branchCount: newBranchIds.length,
                        });
                        result.summary.totalCreated += newBranchIds.length;
                    }
                }
                catch (error) {
                    result.errors.push({
                        date: typeof holiday.holiday_date === 'string'
                            ? holiday.holiday_date
                            : holiday.holiday_date.toISOString().split('T')[0],
                        name: holiday.holiday_name,
                        error: error.message,
                    });
                    result.summary.totalErrors++;
                }
            }
            return result;
        }
        catch (error) {
            throw new Error(`Failed to sync holidays: ${error.message}`);
        }
    }
    /**
     * Get target branches based on branchIds
     */
    static async getTargetBranches(branchIds) {
        if (branchIds && branchIds.length > 0) {
            return await prisma.branch.findMany({
                where: { id: { in: branchIds } },
                select: { id: true, name: true },
            });
        }
        else {
            return await prisma.branch.findMany({
                select: { id: true, name: true },
            });
        }
    }
    /**
     * Delete existing holidays
     */
    static async deleteExistingHolidays(branches, holidays) {
        const deleted = [];
        for (const holiday of holidays) {
            const holidayDate = new Date(holiday.holiday_date);
            const holidayName = holiday.holiday_name;
            const result = await prisma.branchHoliday.deleteMany({
                where: {
                    branchId: { in: branches.map((b) => b.id) },
                    date: holidayDate,
                    name: holidayName,
                },
            });
            if (result.count > 0) {
                deleted.push({
                    date: holidayDate.toISOString().split('T')[0],
                    name: holidayName,
                    branchCount: result.count,
                });
            }
        }
        return deleted;
    }
    /**
     * Get holiday type label
     */
    static getHolidayTypeLabel(type) {
        const labels = {
            national: 'Libur Nasional',
            regional: 'Libur Regional',
            company: 'Libur Perusahaan',
            custom: 'Libur Khusus',
        };
        return labels[type] || 'Libur';
    }
    /**
     * Sync national holidays to all or specific branches
     */
    static async syncNationalHolidays(nationalHolidays, branchIds) {
        const holidays = nationalHolidays.map((h) => ({
            ...h,
            holiday_type: 'national',
        }));
        return await this.syncHolidays({
            branchIds,
            holidays,
            overwrite: false,
        });
    }
    /**
     * Sync regional holidays to specific branches
     */
    static async syncRegionalHolidays(regionalHolidays, branchIds) {
        if (!branchIds || branchIds.length === 0) {
            throw new Error('Branch IDs are required for regional holidays');
        }
        const holidays = regionalHolidays.map((h) => ({
            ...h,
            holiday_type: 'regional',
        }));
        return await this.syncHolidays({
            branchIds,
            holidays,
            overwrite: false,
        });
    }
    /**
     * Bulk delete holidays by date range
     */
    static async deleteHolidaysByDateRange(startDate, endDate, branchIds) {
        const where = {
            date: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (branchIds && branchIds.length > 0) {
            where.branchId = { in: branchIds };
        }
        const result = await prisma.branchHoliday.deleteMany({ where });
        return {
            deletedCount: result.count,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        };
    }
    /**
     * Get holidays for branches
     */
    static async getHolidaysByBranch(branchIds, startDate, endDate) {
        const where = {};
        if (branchIds && branchIds.length > 0) {
            where.branchId = { in: branchIds };
        }
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = startDate;
            if (endDate)
                where.date.lte = endDate;
        }
        return await prisma.branchHoliday.findMany({
            where,
            include: {
                branch: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: [{ date: 'asc' }, { name: 'asc' }],
        });
    }
}
exports.HolidaySyncHelper = HolidaySyncHelper;
//# sourceMappingURL=holidaySyncHelper.js.map