import { RoomAndDeviceStatus } from "@prisma/client";
import { RoomAndDeviceRepository } from "../repository/roomAndDeviceRepository";
import {
  RoomAndDeviceWithRelations,
  RoomAndDeviceConfig,
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
};
