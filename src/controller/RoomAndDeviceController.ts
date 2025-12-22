import { Request, Response } from "express";
import { checkBranchAccess } from "../helper/checkBranchAccessHelper";
import prisma from "../lib/prisma";
import { updateBranchAmenities } from "../helper/branchAmenitiesHelper";

/**
 * POST /branches/:id/rooms-and-devices
 * Owner/staff menambahkan room dan device ke cabang
 */
export const addRoomAndDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.id);
    const userId = BigInt(req.user!.userId);
    const {
      categoryId,
      name,
      deviceType,
      version,
      pricePerHour,
      roomNumber,
      status,
    } = req.body;

    // Cek authorization
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke cabang ini",
      });
      return;
    }

    // Cek category exist dan di cabang yang benar
    const category = await prisma.category.findUnique({
      where: { id: BigInt(categoryId) },
    });

    if (!category || category.branchId !== branchId) {
      res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan atau tidak sesuai dengan cabang",
      });
      return;
    }

    // Cek duplicate room number dalam branch
    const existingRoomAndDevice = await prisma.roomAndDevice.findFirst({
      where: {
        branchId,
        roomNumber,
      },
    });

    if (existingRoomAndDevice) {
      res.status(400).json({
        success: false,
        message: "Nomor ruangan sudah digunakan di cabang ini",
      });
      return;
    }

    // Buat device
    const roomAndDevice = await prisma.roomAndDevice.create({
      data: {
        branchId,
        categoryId,
        name,
        deviceType,
        version,
        pricePerHour,
        roomNumber,
        status,
      },
      include: {
        category: true,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "ADD_ROOM_AND_DEVICE",
        entity: "RoomAndDevice",
        entityId: roomAndDevice.id,
        meta: {
          branchId: branchId.toString(),
          categoryId: categoryId.toString(),
          deviceType,
          roomNumber,
          timestamp: new Date().toISOString(),
        },
      },
    });
    // Auto-update branch amenities
    try {
      await updateBranchAmenities(branchId);
    } catch (error) {
      console.error("Failed to update branch amenities:", error);
      // Don't fail the request if amenities update fails
    }
    // Auto-update branch amenities
    try {
      await updateBranchAmenities(branchId);
    } catch (error) {
      console.error("Failed to update branch amenities:", error);
      // Don't fail the request if amenities update fails
    }

    // Convert BigInt to string for JSON serialization
    const serializedDevice = JSON.parse(
      JSON.stringify(roomAndDevice, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(201).json({
      success: true,
      message: "Room and Device berhasil ditambahkan",
      data: serializedDevice,
    });
  } catch (error) {
    console.error("Add room and device error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan device",
    });
  }
};

/**
 * GET /branches/:branchId/rooms-and-devices
 * Mendapatkan semua room dan device di cabang
 */
export const getRoomsAndDevices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const { deviceType, status, categoryId, search } = req.query;

    const where: any = { branchId };

    if (deviceType) {
      where.deviceType = deviceType;
    }

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = BigInt(categoryId as string);
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { roomNumber: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const roomsAndDevices = await prisma.roomAndDevice.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            tier: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
      orderBy: [{ roomNumber: "asc" }],
    });

    const serialized = JSON.parse(
      JSON.stringify(roomsAndDevices, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serialized,
    });
  } catch (error) {
    console.error("Get rooms and devices error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data rooms and devices",
    });
  }
};

/**
 * GET /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Mendapatkan detail room dan device di cabang
 */
export const getRoomAndDeviceDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);

    const roomAndDevice = await prisma.roomAndDevice.findUnique({
      where: { id: roomAndDeviceId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            tier: true,
            pricePerHour: true,
            amenities: true,
          },
        },
        sessions: {
          where: {
            status: "running",
          },
          orderBy: { startedAt: "desc" },
          take: 5,
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    if (!roomAndDevice || roomAndDevice.branchId !== branchId) {
      res.status(404).json({
        success: false,
        message: "Room and device tidak ditemukan di cabang ini",
      });
      return;
    }

    const serialized = JSON.parse(
      JSON.stringify(roomAndDevice, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      data: serialized,
    });
  } catch (error) {
    console.error("Get room and device details error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil detail room and device",
    });
  }
};

/**
 * PUT /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Owner/staff mengupdate room dan device di cabang
 */
export const updateRoomAndDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
    const userId = BigInt(req.user!.userId);
    const {
      categoryId,
      name,
      deviceType,
      version,
      pricePerHour,
      roomNumber,
      status,
    } = req.body;

    // Cek authorization
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke cabang ini",
      });
      return;
    }

    // Cek device exist dan di cabang yang benar
    const roomAndDevice = await prisma.roomAndDevice.findUnique({
      where: { id: roomAndDeviceId },
    });

    if (!roomAndDevice || roomAndDevice.branchId !== branchId) {
      res.status(404).json({
        success: false,
        message: "Room dan device tidak ditemukan di cabang ini",
      });
      return;
    }

    // Cek duplicate room number jika diubah
    if (roomNumber && roomNumber !== roomAndDevice.roomNumber) {
      const existingRoom = await prisma.roomAndDevice.findFirst({
        where: {
          branchId,
          roomNumber,
          id: { not: roomAndDeviceId },
        },
      });

      if (existingRoom) {
        res.status(400).json({
          success: false,
          message: "Nomor ruangan sudah digunakan di cabang ini",
        });
        return;
      }
    }

    // Update device
    const updatedDevice = await prisma.roomAndDevice.update({
      where: { id: roomAndDeviceId, roomNumber },
      data: {
        categoryId:
          categoryId !== undefined
            ? categoryId
              ? BigInt(categoryId)
              : null
            : roomAndDevice.categoryId,
        name: name || roomAndDevice.name,
        deviceType: deviceType || roomAndDevice.deviceType,
        version: version !== undefined ? version : roomAndDevice.version,
        pricePerHour:
          pricePerHour !== undefined
            ? pricePerHour
            : roomAndDevice.pricePerHour,
        roomNumber: roomNumber || roomAndDevice.roomNumber,
        status: status !== undefined ? status : roomAndDevice.status,
      },
      include: {
        category: true,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "UPDATE_DEVICE",
        entity: "Device",
        entityId: roomAndDeviceId,
        meta: {
          branchId: branchId.toString(),
          changes: req.body,
          timestamp: new Date().toISOString(),
        },
      },
    });
    // Auto-update branch amenities
    try {
      await updateBranchAmenities(branchId);
    } catch (error) {
      console.error("Failed to update branch amenities:", error);
      // Don't fail the request if amenities update fails
    }
    // Auto-update branch amenities
    try {
      await updateBranchAmenities(branchId);
    } catch (error) {
      console.error("Failed to update branch amenities:", error);
      // Don't fail the request if amenities update fails
    }

    // Convert BigInt to string for JSON serialization
    const serializedDevice = JSON.parse(
      JSON.stringify(updatedDevice, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      success: true,
      message: "Device berhasil diupdate",
      data: serializedDevice,
    });
  } catch (error) {
    console.error("Update device error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate device",
    });
  }
};

/**
 * DELETE /branches/:branchId/devices/:deviceId
 * Owner/staff menghapus device dari cabang
 */
export const deleteRoomAndDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = BigInt(req.params.branchId);
    const roomAndDeviceId = BigInt(req.params.roomAndDeviceId);
    const userId = BigInt(req.user!.userId);

    // Cek authorization
    const hasAccess = await checkBranchAccess(userId, branchId);
    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke cabang ini",
      });
      return;
    }

    // Cek device exist dan di cabang yang benar
    const device = await prisma.roomAndDevice.findUnique({
      where: { id: roomAndDeviceId },
      include: {
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    if (!device || device.branchId !== branchId) {
      res.status(404).json({
        success: false,
        message: "Device tidak ditemukan di cabang ini",
      });
      return;
    }

    // Cek apakah device punya session aktif
    if (device._count.sessions > 0) {
      res.status(400).json({
        success: false,
        message:
          "Tidak dapat menghapus device yang memiliki riwayat session. Ubah status menjadi 'disabled' jika ingin menonaktifkan.",
      });
      return;
    }

    // Delete device
    await prisma.roomAndDevice.delete({
      where: { id: roomAndDeviceId },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: "DELETE_DEVICE",
        entity: "Device",
        entityId: roomAndDeviceId,
        meta: {
          branchId: branchId.toString(),
          deviceType: device.deviceType,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Auto-update branch amenities
    try {
      await updateBranchAmenities(branchId);
    } catch (error) {
      console.error("Failed to update branch amenities:", error);
      // Don't fail the request if amenities update fails
    }

    res.status(200).json({
      success: true,
      message: "Device berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete device error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus device",
    });
  }
};
