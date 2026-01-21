// lib/helpers/holiday-sync.helper.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface HolidayData {
  holiday_date: string | Date;
  holiday_name: string;
  description?: string;
}

export interface SyncHolidaysOptions {
  branchIds?: string[]; // Specific branch IDs, if empty sync to all branches
  holidays: HolidayData[];
  overwrite?: boolean; // If true, update existing holidays
  deleteExisting?: boolean; // If true, delete existing holidays before sync
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

export class HolidaySyncHelper {
  /**
   * Sync holidays to branches
   */
  static async syncHolidays(
    options: SyncHolidaysOptions
  ): Promise<SyncHolidaysResult> {
    const {
      branchIds,
      holidays,
      overwrite = false,
      deleteExisting = false,
    } = options;

    const result: SyncHolidaysResult = {
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
        result.summary.totalDeleted = deleted.reduce(
          (sum, h) => sum + h.branchCount,
          0
        );
      }

      // Process each holiday
      for (const holiday of holidays) {
        try {
          const holidayDate = new Date(holiday.holiday_date);
          const holidayName = holiday.holiday_name;
          const holidayType = holiday.holiday_type || 'custom';
          const description =
            holiday.description ||
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
          } else if (existing.length > 0 && !overwrite) {
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
        } catch (error: any) {
          result.errors.push({
            date:
              typeof holiday.holiday_date === 'string'
                ? holiday.holiday_date
                : holiday.holiday_date.toISOString().split('T')[0],
            name: holiday.holiday_name,
            error: error.message,
          });
          result.summary.totalErrors++;
        }
      }

      return result;
    } catch (error: any) {
      throw new Error(`Failed to sync holidays: ${error.message}`);
    }
  }

  /**
   * Get target branches based on branchIds
   */
  private static async getTargetBranches(branchIds?: string[]) {
    if (branchIds && branchIds.length > 0) {
      return await prisma.branch.findMany({
        where: { id: { in: branchIds } },
        select: { id: true, name: true },
      });
    } else {
      return await prisma.branch.findMany({
        select: { id: true, name: true },
      });
    }
  }

  /**
   * Delete existing holidays
   */
  private static async deleteExistingHolidays(
    branches: Array<{ id: string }>,
    holidays: HolidayData[]
  ) {
    const deleted: Array<{
      date: string;
      name: string;
      branchCount: number;
    }> = [];

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
  private static getHolidayTypeLabel(type: string): string {
    const labels: Record<string, string> = {
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
  static async syncNationalHolidays(
    nationalHolidays: HolidayData[],
    branchIds?: string[]
  ) {
    const holidays = nationalHolidays.map((h) => ({
      ...h,
      holiday_type: 'national' as const,
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
  static async syncRegionalHolidays(
    regionalHolidays: HolidayData[],
    branchIds: string[]
  ) {
    if (!branchIds || branchIds.length === 0) {
      throw new Error('Branch IDs are required for regional holidays');
    }

    const holidays = regionalHolidays.map((h) => ({
      ...h,
      holiday_type: 'regional' as const,
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
  static async deleteHolidaysByDateRange(
    startDate: Date,
    endDate: Date,
    branchIds?: string[]
  ) {
    const where: any = {
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
  static async getHolidaysByBranch(
    branchIds?: string[],
    startDate?: Date,
    endDate?: Date
  ) {
    const where: any = {};

    if (branchIds && branchIds.length > 0) {
      where.branchId = { in: branchIds };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
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