import { Request, Response } from "express";
import prisma from "../lib/prisma";

/**
 * POST /holidays/national/sync/:year
 * Sync libur nasional Indonesia dari API eksternal (api-harilibur.vercel.app)
 */
export const syncNationalHolidays = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { year } = req.params;
    const yearNum = parseInt(year);

    if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2030) {
      res.status(400).json({
        success: false,
        message: "Tahun harus antara 2020-2030",
      });
      return;
    }

    // Get all branches
    const branches = await prisma.branch.findMany({
      select: { id: true, name: true },
    });

    if (branches.length === 0) {
      res.status(404).json({
        success: false,
        message: "Tidak ada branch ditemukan",
      });
      return;
    }

    // Fetch from external API
    const response = await fetch(
      `https://api-harilibur.vercel.app/api?year=${yearNum}`
    );

    if (!response.ok) {
      res.status(502).json({
        success: false,
        message: "Gagal mengambil data dari API eksternal",
      });
      return;
    }

    const apiData = await response.json();

    // Validate response format
    if (!Array.isArray(apiData)) {
      res.status(502).json({
        success: false,
        message: "Format response dari API tidak valid",
      });
      return;
    }

    // Filter hanya libur nasional (is_national_holiday: true)
    const nationalHolidays = apiData.filter(
      (holiday: any) => holiday.is_national_holiday === true
    );

    if (nationalHolidays.length === 0) {
      res.status(404).json({
        success: false,
        message: `Tidak ada data libur nasional untuk tahun ${yearNum}`,
      });
      return;
    }

    const createdHolidays = [];
    const skippedHolidays = [];
    const errors = [];

    // Create holidays for all branches
    for (const holiday of nationalHolidays) {
      try {
        const holidayDate = new Date(holiday.holiday_date);
        const holidayName = holiday.holiday_name;
        const description = `${holiday.holiday_name} - Libur Nasional`;

        // Create for all branches
        await Promise.all(
          branches.map((branch) =>
            prisma.branchHoliday.create({
              data: {
                branchId: branch.id,
                date: holidayDate,
                name: holidayName,
                description: description,
              },
            })
          )
        );

        createdHolidays.push({
          date: holiday.holiday_date,
          name: holidayName,
        });
      } catch (error: any) {
        if (error.code === "P2002") {
          // Unique constraint violation - already exists
          skippedHolidays.push({
            date: holiday.holiday_date,
            name: holiday.holiday_name,
            reason: "Already exists",
          });
        } else {
          errors.push({
            date: holiday.holiday_date,
            name: holiday.holiday_name,
            error: error.message,
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `Berhasil sync ${createdHolidays.length} libur nasional tahun ${yearNum}`,
      data: {
        year: yearNum,
        affectedBranches: branches.length,
        totalFromAPI: nationalHolidays.length,
        created: createdHolidays.length,
        skipped: skippedHolidays.length,
        failed: errors.length,
        createdList: createdHolidays,
        skippedList: skippedHolidays.length > 0 ? skippedHolidays : undefined,
        errorList: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error: any) {
    console.error("Sync national holidays error:", error);

    if (error.name === "FetchError" || error.code === "ENOTFOUND") {
      res.status(502).json({
        success: false,
        message:
          "Tidak dapat terhubung ke API eksternal. Cek koneksi internet.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat sync libur nasional",
    });
  }
};

/**
 * POST /holidays/custom
 * Menambahkan hari libur custom untuk branch tertentu
 */
export const addCustomHoliday = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { branchId, date, name, description } = req.body;

    if (!branchId || !date || !name) {
      res.status(400).json({
        success: false,
        message: "Branch ID, date, dan name wajib diisi",
      });
      return;
    }

    const branchIdBigInt = BigInt(branchId);
    const holidayDate = new Date(date);

    // Check if branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: branchIdBigInt },
      select: { id: true, name: true },
    });

    if (!branch) {
      res.status(404).json({
        success: false,
        message: "Branch tidak ditemukan",
      });
      return;
    }

    // Create holiday
    const holiday = await prisma.branchHoliday.create({
      data: {
        branchId: branchIdBigInt,
        date: holidayDate,
        name,
        description: description || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Hari libur berhasil ditambahkan",
      data: {
        id: holiday.id.toString(),
        branchId: holiday.branchId.toString(),
        branchName: branch.name,
        date: holiday.date,
        name: holiday.name,
        description: holiday.description,
      },
    });
  } catch (error: any) {
    console.error("Add custom holiday error:", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Hari libur sudah ada untuk branch ini pada tanggal tersebut",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan hari libur",
    });
  }
};

/**
 * GET /holidays
 * Mendapatkan daftar hari libur (dengan filter optional)
 */
export const getHolidays = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { branchId, startDate, endDate, year } = req.query;

    // Build filter
    const where: any = {};

    if (branchId) {
      where.branchId = BigInt(branchId as string);
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    } else if (year) {
      const yearNum = parseInt(year as string);
      where.date = {
        gte: new Date(yearNum, 0, 1),
        lte: new Date(yearNum, 11, 31),
      };
    }

    const holidays = await prisma.branchHoliday.findMany({
      where,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ date: "asc" }, { name: "asc" }],
    });

    const serialized = holidays.map((holiday) => ({
      id: holiday.id.toString(),
      branchId: holiday.branchId.toString(),
      branchName: holiday.branch.name,
      date: holiday.date,
      name: holiday.name,
      description: holiday.description,
    }));

    res.status(200).json({
      success: true,
      data: serialized,
      meta: {
        total: serialized.length,
        filters: {
          branchId: branchId || null,
          startDate: startDate || null,
          endDate: endDate || null,
          year: year || null,
        },
      },
    });
  } catch (error) {
    console.error("Get holidays error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data hari libur",
    });
  }
};

/**
 * PUT /holidays/:id
 * Update hari libur
 */
export const updateHoliday = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, name, description } = req.body;

    const holidayId = BigInt(id);

    // Check if holiday exists
    const existingHoliday = await prisma.branchHoliday.findUnique({
      where: { id: holidayId },
      include: {
        branch: {
          select: { name: true },
        },
      },
    });

    if (!existingHoliday) {
      res.status(404).json({
        success: false,
        message: "Hari libur tidak ditemukan",
      });
      return;
    }

    // Build update data
    const updateData: any = {};
    if (date) updateData.date = new Date(date);
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;

    // Update holiday
    const updatedHoliday = await prisma.branchHoliday.update({
      where: { id: holidayId },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Hari libur berhasil diupdate",
      data: {
        id: updatedHoliday.id.toString(),
        branchId: updatedHoliday.branchId.toString(),
        branchName: existingHoliday.branch.name,
        date: updatedHoliday.date,
        name: updatedHoliday.name,
        description: updatedHoliday.description,
      },
    });
  } catch (error: any) {
    console.error("Update holiday error:", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Hari libur sudah ada untuk branch ini pada tanggal tersebut",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate hari libur",
    });
  }
};

/**
 * DELETE /holidays/:id
 * Hapus hari libur
 */
export const deleteHoliday = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const holidayId = BigInt(id);

    // Check if holiday exists
    const existingHoliday = await prisma.branchHoliday.findUnique({
      where: { id: holidayId },
      include: {
        branch: {
          select: { name: true },
        },
      },
    });

    if (!existingHoliday) {
      res.status(404).json({
        success: false,
        message: "Hari libur tidak ditemukan",
      });
      return;
    }

    // Delete holiday
    await prisma.branchHoliday.delete({
      where: { id: holidayId },
    });

    res.status(200).json({
      success: true,
      message: "Hari libur berhasil dihapus",
      data: {
        id: existingHoliday.id.toString(),
        branchName: existingHoliday.branch.name,
        date: existingHoliday.date,
        name: existingHoliday.name,
      },
    });
  } catch (error) {
    console.error("Delete holiday error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus hari libur",
    });
  }
};

/**
 * DELETE /holidays/national/:date
 * Hapus hari libur nasional (semua branch pada tanggal tertentu)
 */
export const deleteNationalHoliday = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { date } = req.params;
    const { name } = req.query; // Optional: filter by name

    const holidayDate = new Date(date);

    // Build filter
    const where: any = {
      date: holidayDate,
    };

    if (name) {
      where.name = name as string;
    }

    // Delete holidays
    const result = await prisma.branchHoliday.deleteMany({
      where,
    });

    if (result.count === 0) {
      res.status(404).json({
        success: false,
        message: "Tidak ada hari libur ditemukan untuk tanggal tersebut",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `${result.count} hari libur berhasil dihapus`,
      data: {
        date: holidayDate,
        deletedCount: result.count,
      },
    });
  } catch (error) {
    console.error("Delete national holiday error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus hari libur nasional",
    });
  }
};
