import { prisma } from "../../database";
import { BranchRepository } from "../../repository/branchRepository";
import { CategoryRepository } from "../../repository/categoryRepository";
import { RoomAndDeviceRepository } from "../../repository/roomAndDeviceRepository";
import { checkBranchAccess } from "../../helper/checkBranchAccessHelper";
import { updateBranchAmenities } from "../../helper/branchAmenitiesHelper";

// Queries
import { RoomAndDeviceQuery } from "../../queries/roomAndDeviceQuery";

// Error imports
import { HasNoAccessError } from "../../errors/UserError/userError";
import { BranchNotFoundError } from "../../errors/BranchError/branchError";
import { CategoryNotFoundError } from "../../errors/CategoryError/categoryError";
import {
  DuplicateRoomAndDeviceError,
  RoomAndDeviceNotFoundError,
  DeviceHasActiveSessionError,
  DeviceHasOrderItemsError
} from "../../errors/RoomAndDeviceError/roomAndDeviceError";

/**
 * Add room and device to branch
 */
export const addRoomAndDeviceService = async (payload: {
  userId: bigint;
  branchId: bigint;
  categoryId: bigint;
  name: string;
  deviceType: string;
  version: string;
  pricePerHour: number;
  roomNumber: string;
}) => {
  const {
    userId,
    branchId,
    categoryId,
    name,
    deviceType,
    version,
    pricePerHour,
    roomNumber,
  } = payload;

  // Verify authorization
  const hasAccess = await checkBranchAccess(userId, branchId);
  if (!hasAccess) {
    throw new HasNoAccessError();
  }

  // Verify branch exists
  const branch = await BranchRepository.findById(branchId);
  if (!branch) {
    throw new BranchNotFoundError();
  }

  // Verify category exists and belongs to branch
  const category = await CategoryRepository.findById(categoryId);
  if (!category || category.branchId !== branchId) {
    throw new CategoryNotFoundError();
  }

  // Check duplicate room number
  const existingRoom = await RoomAndDeviceRepository.findFirst({
    branchId,
    roomNumber,
  });
  if (existingRoom) {
    throw new DuplicateRoomAndDeviceError();
  }

  // Create device
  const device = await RoomAndDeviceRepository.create({
    branchId,
    categoryId,
    name,
    deviceType,
    version,
    pricePerHour,
    roomNumber,
    status: "available",
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId,
      action: "ADD_ROOM_AND_DEVICE",
      entity: "RoomAndDevice",
      entityId: device.id,
      meta: {
        branchId: branchId.toString(),
        categoryId: categoryId.toString(),
        deviceType,
        roomNumber,
        timestamp: new Date().toISOString(),
      },
    },
  });

  // Update branch amenities (single call)
  try {
    await updateBranchAmenities(branchId);
  } catch (error) {
    console.error("Failed to update branch amenities:", error);
    // Don't fail the request if amenities update fails
  }

  return device;
};

/**
 * Get rooms and devices by branch with filters
 */
export const getRoomsAndDevicesService = async (payload: {
  branchId: bigint;
  deviceType?: string;
  status?: string;
  categoryId?: bigint;
  search?: string;
  skip?: number;
  take?: number;
}) => {
  const {
    branchId,
    deviceType,
    status,
    categoryId,
    search,
    skip = 0,
    take = 10,
  } = payload;

  const where: any = { branchId };

  if (deviceType && deviceType !== "undefined") {
    where.deviceType = deviceType;
  }

  if (status && status !== "undefined") {
    where.status = status;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (search && search !== "undefined") {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { roomNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  const devices = await RoomAndDeviceRepository.findMany(where, skip, take);
  const total = await RoomAndDeviceRepository.count(where);

  return { devices, total };
};

/**
 * Get room and device details by ID
 */
export const getRoomAndDeviceDetailsService = async (payload: {
  roomAndDeviceId: bigint;
  branchId: bigint;
}) => {
  const { roomAndDeviceId, branchId } = payload;

  const device = await RoomAndDeviceRepository.findById(roomAndDeviceId);
  if (!device || device.branchId !== branchId) {
    throw new RoomAndDeviceNotFoundError();
  }

  // Get additional details with sessions
  const deviceWithSessions = await RoomAndDeviceRepository.findUnique(
    {
      id: roomAndDeviceId,
    },
    {
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
    },
  );

  return deviceWithSessions;
};

/**
 * Update room and device
 */
export const updateRoomAndDeviceService = async (payload: {
  userId: bigint;
  branchId: bigint;
  roomAndDeviceId: bigint;
  categoryId?: bigint;
  name?: string;
  deviceType?: string;
  version?: string;
  pricePerHour?: number;
  roomNumber?: string;
  status?: string;
}) => {
  const {
    userId,
    branchId,
    roomAndDeviceId,
    categoryId,
    name,
    deviceType,
    version,
    pricePerHour,
    roomNumber,
    status,
  } = payload;

  // Verify authorization
  const hasAccess = await checkBranchAccess(userId, branchId);
  if (!hasAccess) {
    throw new HasNoAccessError();
  }

  // Get existing device
  const device = await RoomAndDeviceRepository.findById(
    roomAndDeviceId,
    branchId,
  );
  if (!device) {
    throw new RoomAndDeviceNotFoundError();
  }

  // Check for duplicate room number if being changed
  if (roomNumber && roomNumber !== device.roomNumber) {
    const existingRoom = await RoomAndDeviceRepository.findFirst({
      branchId,
      roomNumber,
      id: { not: roomAndDeviceId },
    });

    if (existingRoom) {
      throw new DuplicateRoomAndDeviceError();
    }
  }

  // Verify category if provided
  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.branchId !== branchId) {
      throw new CategoryNotFoundError();
    }
  }

  // Update device
  const updateData: any = {};
  if (categoryId !== undefined) {
    updateData.categoryId = categoryId;
  }
  if (name !== undefined) {
    updateData.name = name;
  }
  if (deviceType !== undefined) {
    updateData.deviceType = deviceType;
  }
  if (version !== undefined) {
    updateData.version = version;
  }
  if (pricePerHour !== undefined) {
    updateData.pricePerHour = pricePerHour;
  }
  if (roomNumber !== undefined) {
    updateData.roomNumber = roomNumber;
  }
  if (status !== undefined) {
    updateData.status = status;
  }

  const updatedDevice = await RoomAndDeviceRepository.update(
    roomAndDeviceId,
    updateData,
  );

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId,
      action: "UPDATE_ROOM_AND_DEVICE",
      entity: "RoomAndDevice",
      entityId: roomAndDeviceId,
      meta: {
        branchId: branchId.toString(),
        changes: updateData,
        timestamp: new Date().toISOString(),
      },
    },
  });

  // Update branch amenities (single call - FIXED duplication)
  try {
    await updateBranchAmenities(branchId);
  } catch (error) {
    console.error("Failed to update branch amenities:", error);
    // Don't fail the request if amenities update fails
  }

  return updatedDevice;
};

/**
 * Delete room and device
 */
export const deleteRoomAndDeviceService = async (payload: {
  userId: bigint;
  branchId: bigint;
  roomAndDeviceId: bigint;
}) => {
  const { userId, branchId, roomAndDeviceId } = payload;

  // Verify authorization
  const hasAccess = await checkBranchAccess(userId, branchId);
  if (!hasAccess) {
    throw new HasNoAccessError();
  }

  // Get device with session count
  const device = await RoomAndDeviceQuery.findUniqueWithCount(roomAndDeviceId);

  if (!device || device.branchId !== branchId) {
    throw new RoomAndDeviceNotFoundError();
  }

  // Check if device has sessions
  if (device._count.sessions > 0) {
    throw new DeviceHasActiveSessionError();
  }

  // Check if device has order items
  if (device._count.orderItems > 0) {
    throw new DeviceHasOrderItemsError();
  }

  // Delete device
  await RoomAndDeviceRepository.delete(roomAndDeviceId);

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId,
      action: "DELETE_ROOM_AND_DEVICE",
      entity: "RoomAndDevice",
      entityId: roomAndDeviceId,
      meta: {
        branchId: branchId.toString(),
        deviceType: device.deviceType,
        timestamp: new Date().toISOString(),
      },
    },
  });

  // Update branch amenities (single call)
  try {
    await updateBranchAmenities(branchId);
  } catch (error) {
    console.error("Failed to update branch amenities:", error);
    // Don't fail the request if amenities update fails
  }

  return { success: true };
};
