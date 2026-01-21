// Database
import { prisma } from "../../database";

// Types
interface SyncNationalHolidaysPayload {
  branchIds?: string[]; // Specific branch IDs, if empty sync to all branches
  year: number;
  overwrite?: boolean;
  deleteExisting?: boolean;
}

// Repository
import { BranchHolidayRepository } from "../../repository/branchHolidayRepository";

// Errors
import {
  YearInvalidError,
  FailedToFetchHolidaysError,
  FormatResponseInvalidError,
  NationalHolidayNotFoundError,
} from "../../errors/HolidayError/holidayError";
import { BranchNotFoundError } from "../../errors/BranchError/branchError";

interface AddCustomHolidayPayload {
  branchIds?: string[]; // Specific branch IDs, if empty sync to all branches
  date: string;
  name: string;
  description?: string;
  overwrite?: boolean;
}

interface AddCustomHolidaysPayload {
  branchIds?: string[]; // Specific branch IDs, if empty sync to all branches
  holidays: Array<{
    date: string;
    name: string;
    description?: string;
  }>;
  overwrite?: boolean;
}

interface DeleteBranchHolidayPayload {
  branchIds?: string[]; // Specific branch IDs, if empty delete from all branches
  holidayId?: bigint;
  startDate?: string;
  endDate?: string;
}

interface GetBranchHolidaysPayload {
  branchId: bigint;
  startDate?: string;
  endDate?: string;
}

// Service function to sync national holidays
export async function syncNationalHolidaysService(
  payload: SyncNationalHolidaysPayload,
) {
  const {
    branchIds,
    year,
    overwrite = false,
    deleteExisting = false,
  } = payload;

  if (isNaN(year) || year < 2020 || year > 2030) {
    throw new YearInvalidError();
  }

  // Get target branches
  let branches;
  if (branchIds && branchIds.length > 0) {
    const bigIntIds = branchIds.map((id) => BigInt(id)) as bigint[];
    branches = await prisma.branch.findMany({
      where: { id: { in: bigIntIds } },
      select: { id: true, name: true },
    });
  } else {
    branches = await prisma.branch.findMany({
      select: { id: true, name: true },
    });
  }

  if (branches.length === 0) {
    throw new BranchNotFoundError();
  }

  // Fetch from external API
  const response = await fetch(
    `https://api-harilibur.vercel.app/api?year=${year}`,
  );

  if (!response.ok) {
    throw new FailedToFetchHolidaysError();
  }

  const apiData = await response.json();

  // Validate response format
  if (!Array.isArray(apiData)) {
    throw new FormatResponseInvalidError();
  }

  // Filter hanya libur nasional
  const nationalHolidays = apiData.filter(
    (holiday: any) => holiday.is_national_holiday === true,
  );

  if (nationalHolidays.length === 0) {
    throw new NationalHolidayNotFoundError();
  }

  const createdHolidays = [];
  const updatedHolidays = [];
  const skippedHolidays = [];
  const deletedHolidays = [];
  const errors = [];

  // Delete existing holidays if requested
  if (deleteExisting) {
    for (const holiday of nationalHolidays) {
      const holidayDate = new Date(holiday.holiday_date);
      const result = await prisma.branchHoliday.deleteMany({
        where: {
          branchId: { in: branches.map((b) => b.id) },
          date: holidayDate,
          name: holiday.holiday_name,
        },
      });

      if (result.count > 0) {
        deletedHolidays.push({
          date: holiday.holiday_date,
          name: holiday.holiday_name,
          branchCount: result.count,
        });
      }
    }
  }

  // Create or update holidays for all branches
  for (const holiday of nationalHolidays) {
    try {
      const holidayDate = new Date(holiday.holiday_date);
      const holidayName = holiday.holiday_name;
      const description = `${holiday.holiday_name} - Libur Nasional`;

      // Check existing holidays
      const existing = await BranchHolidayRepository.findMany({
        branchId: { in: branches.map((b) => b.id) },
        date: holidayDate,
        name: holidayName,
      });

      const existingBranchIds = existing.map((h) => h.branchId);
      const newBranchIds = branches
        .filter((b) => !existingBranchIds.includes(b.id))
        .map((b) => b.id);

      // Update existing if overwrite is true
      if (overwrite && existing.length > 0) {
        await BranchHolidayRepository.updateMany(
          {
            branchId: { in: existingBranchIds },
            date: holidayDate,
            name: holidayName,
          },
          {
            description: description,
          },
        );

        updatedHolidays.push({
          date: holiday.holiday_date,
          name: holidayName,
          branchCount: existing.length,
        });
      } else if (existing.length > 0 && !overwrite) {
        skippedHolidays.push({
          date: holiday.holiday_date,
          name: holidayName,
          reason: `Already exists in ${existing.length} branch(es)`,
          branchCount: existing.length,
        });
      }

      // Create new holidays
      if (newBranchIds.length > 0) {
        await BranchHolidayRepository.createMany(
          newBranchIds.map((branchId) => ({
            branchId,
            date: holidayDate,
            name: holidayName,
            description: description,
          })),
        );

        createdHolidays.push({
          date: holiday.holiday_date,
          name: holidayName,
          branchCount: newBranchIds.length,
        });
      }
    } catch (error: any) {
      if (error.code !== "P2002") {
        errors.push({
          date: holiday.holiday_date,
          name: holiday.holiday_name,
          error: error.message,
        });
      }
    }
  }

  return {
    year,
    targetBranches: branches.length,
    totalFromAPI: nationalHolidays.length,
    created: createdHolidays.length,
    updated: updatedHolidays.length,
    skipped: skippedHolidays.length,
    deleted: deletedHolidays.length,
    failed: errors.length,
    createdList: createdHolidays,
    updatedList: updatedHolidays.length > 0 ? updatedHolidays : undefined,
    skippedList: skippedHolidays.length > 0 ? skippedHolidays : undefined,
    deletedList: deletedHolidays.length > 0 ? deletedHolidays : undefined,
    errorList: errors.length > 0 ? errors : undefined,
  };
}

// Service function to add custom holiday
export async function addCustomHolidayService(
  payload: AddCustomHolidayPayload,
) {
  const { branchIds, date, name, description, overwrite = false } = payload;

  if (!date || !name) {
    throw new Error("Date dan name wajib diisi");
  }

  const holidayDate = new Date(date);

  // Get target branches
  let branches;
  if (branchIds && branchIds.length > 0) {
    const bigIntIds = branchIds.map((id) => BigInt(id)) as bigint[];
    branches = await prisma.branch.findMany({
      where: { id: { in: bigIntIds } },
      select: { id: true, name: true },
    });
  } else {
    branches = await prisma.branch.findMany({
      select: { id: true, name: true },
    });
  }

  if (branches.length === 0) {
    throw new BranchNotFoundError();
  }

  const createdHolidays = [];
  const updatedHolidays = [];
  const skippedHolidays = [];
  const errors = [];

  for (const branch of branches) {
    try {
      // Check if holiday exists
      const existing = await prisma.branchHoliday.findFirst({
        where: {
          branchId: branch.id,
          date: holidayDate,
          name: name,
        },
      });

      if (existing) {
        if (overwrite) {
          // Update existing holiday
          await prisma.branchHoliday.update({
            where: { id: existing.id },
            data: {
              description: description || existing.description,
            },
          });

          updatedHolidays.push({
            id: existing.id.toString(),
            branchId: branch.id,
            branchName: branch.name,
            date: holidayDate.toISOString().split("T")[0],
            name: name,
          });
        } else {
          skippedHolidays.push({
            branchId: branch.id,
            branchName: branch.name,
            date: holidayDate.toISOString().split("T")[0],
            name: name,
            reason: "Already exists",
          });
        }
      } else {
        // Create new holiday
        const holiday = await prisma.branchHoliday.create({
          data: {
            branchId: branch.id,
            date: holidayDate,
            name: name,
            description: description || null,
          },
        });

        createdHolidays.push({
          id: holiday.id.toString(),
          branchId: branch.id,
          branchName: branch.name,
          date: holidayDate.toISOString().split("T")[0],
          name: name,
        });
      }
    } catch (error: any) {
      errors.push({
        branchId: branch.id,
        branchName: branch.name,
        error: error.message,
      });
    }
  }

  return {
    date: holidayDate.toISOString().split("T")[0],
    name: name,
    targetBranches: branches.length,
    created: createdHolidays.length,
    updated: updatedHolidays.length,
    skipped: skippedHolidays.length,
    failed: errors.length,
    createdList: createdHolidays.length > 0 ? createdHolidays : undefined,
    updatedList: updatedHolidays.length > 0 ? updatedHolidays : undefined,
    skippedList: skippedHolidays.length > 0 ? skippedHolidays : undefined,
    errorList: errors.length > 0 ? errors : undefined,
  };
}

// Service function to add multiple custom holidays
export async function addCustomHolidaysService(
  payload: AddCustomHolidaysPayload,
) {
  const { branchIds, holidays, overwrite = false } = payload;

  if (!holidays || holidays.length === 0) {
    throw new Error("Minimal ada 1 holiday yang harus ditambahkan");
  }

  // Get target branches
  let branches;
  if (branchIds && branchIds.length > 0) {
    const bigIntIds = branchIds.map((id) => BigInt(id)) as bigint[];
    branches = await prisma.branch.findMany({
      where: { id: { in: bigIntIds } },
      select: { id: true, name: true },
    });
  } else {
    branches = await prisma.branch.findMany({
      select: { id: true, name: true },
    });
  }

  if (branches.length === 0) {
    throw new BranchNotFoundError();
  }

  const results = {
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    createdList: [] as any[],
    updatedList: [] as any[],
    skippedList: [] as any[],
    errorList: [] as any[],
  };

  for (const holiday of holidays) {
    const result = await addCustomHolidayService({
      branchIds,
      date: holiday.date,
      name: holiday.name,
      description: holiday.description,
      overwrite,
    });

    results.created += result.created;
    results.updated += result.updated;
    results.skipped += result.skipped;
    results.failed += result.failed;

    if (result.createdList) results.createdList.push(...result.createdList);
    if (result.updatedList) results.updatedList.push(...result.updatedList);
    if (result.skippedList) results.skippedList.push(...result.skippedList);
    if (result.errorList) results.errorList.push(...result.errorList);
  }

  return {
    totalHolidays: holidays.length,
    targetBranches: branches.length,
    ...results,
  };
}

// Service function to get branch holidays
export async function getBranchHolidaysService(
  payload: GetBranchHolidaysPayload,
) {
  const { branchId, startDate, endDate } = payload;

  // Check if branch exists
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
  });

  if (!branch) {
    throw new BranchNotFoundError();
  }

  const where: any = { branchId };

  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  } else if (startDate) {
    where.date = { gte: new Date(startDate) };
  } else if (endDate) {
    where.date = { lte: new Date(endDate) };
  }

  const holidays = await prisma.branchHoliday.findMany({
    where,
    orderBy: { date: "asc" },
  });

  return holidays;
}

// Service function to delete branch holiday(s)
export async function deleteBranchHolidayService(
  payload: DeleteBranchHolidayPayload,
) {
  const { branchIds, holidayId, startDate, endDate } = payload;

  if (!holidayId && !startDate && !endDate) {
    throw new Error(
      "Minimal harus provide holidayId atau startDate & endDate untuk delete",
    );
  }

  // Get target branches
  let branches;
  if (branchIds && branchIds.length > 0) {
    const bigIntIds = branchIds.map((id) => BigInt(id)) as bigint[];
    branches = await prisma.branch.findMany({
      where: { id: { in: bigIntIds } },
      select: { id: true, name: true },
    });
  } else {
    branches = await prisma.branch.findMany({
      select: { id: true, name: true },
    });
  }

  if (branches.length === 0) {
    throw new Error("Tidak ada branch yang ditemukan");
  }

  const branchIdsList = branches.map((b) => b.id);
  let result;

  if (holidayId) {
    // Delete specific holiday from branches
    const holiday = await prisma.branchHoliday.findUnique({
      where: { id: holidayId },
    });

    if (!holiday) {
      throw new Error("Holiday tidak ditemukan");
    }

    if (!branchIdsList.includes(holiday.branchId)) {
      throw new Error("Holiday tidak ditemukan di branch yang ditargetkan");
    }

    result = await prisma.branchHoliday.deleteMany({
      where: {
        id: holidayId,
      },
    });

    return {
      deletedCount: result.count,
      holidayId: holidayId.toString(),
      branchId: holiday.branchId,
    };
  } else {
    // Delete by date range
    const where: any = {
      branchId: { in: branchIdsList },
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.date = { gte: new Date(startDate) };
    } else if (endDate) {
      where.date = { lte: new Date(endDate) };
    }

    result = await prisma.branchHoliday.deleteMany({ where });

    return {
      deletedCount: result.count,
      startDate: startDate ? startDate.split("T")[0] : undefined,
      endDate: endDate ? endDate.split("T")[0] : undefined,
      affectedBranches: branches.length,
    };
  }
}
