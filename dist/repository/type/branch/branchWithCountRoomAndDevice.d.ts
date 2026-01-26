import { Prisma } from "@prisma/client";
export declare const branchWithCountRoomAndDeviceConfig: {
    include: {
        _count: {
            select: {
                roomAndDevices: {
                    where: {
                        status: "available";
                    };
                };
            };
        };
    };
};
export type BranchWithCountRoomAndDevice = Prisma.BranchGetPayload<typeof branchWithCountRoomAndDeviceConfig>;
//# sourceMappingURL=branchWithCountRoomAndDevice.d.ts.map