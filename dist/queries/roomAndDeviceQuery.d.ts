import { RoomAndDeviceWithRelations, RoomAndDeviceWithSessions } from "../promise/roomAndDevice";
export declare const RoomAndDeviceQuery: {
    findAvailableRoomAndDevicesByBranchAndCategory(branchId: bigint, categoryId: bigint): Promise<RoomAndDeviceWithRelations[]>;
    findUniqueWithCount(id: bigint): Promise<RoomAndDeviceWithSessions>;
};
//# sourceMappingURL=roomAndDeviceQuery.d.ts.map