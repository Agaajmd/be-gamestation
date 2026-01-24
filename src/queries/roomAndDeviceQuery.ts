import { RoomAndDeviceStatus } from "@prisma/client";
import { RoomAndDeviceRepository } from "../repository/roomAndDeviceRepository";
import {
  RoomAndDeviceWithRelations,
  RoomAndDeviceConfig,
  RoomAndDeviceWithSessions,
  RoomAndDeviceWithSessionsConfig,
} from "../promise/roomAndDevice";

export const RoomAndDeviceQuery = {
  async findAvailableRoomAndDevicesByBranchAndCategory(
    branchId: bigint,
    categoryId: bigint,
  ): Promise<RoomAndDeviceWithRelations[]> {
    const result = await RoomAndDeviceRepository.findManyRoomsAndDevices(
      {
        branchId,
        categoryId,
        status: RoomAndDeviceStatus.available,
      },
      RoomAndDeviceConfig,
    );
    return result as RoomAndDeviceWithRelations[];
  },

  async findUniqueWithCount(id: bigint): Promise<RoomAndDeviceWithSessions> {
    const result = await RoomAndDeviceRepository.findUnique(
      {
        id,
      },
      RoomAndDeviceWithSessionsConfig,
    );
    return result as RoomAndDeviceWithSessions;
  },
};
