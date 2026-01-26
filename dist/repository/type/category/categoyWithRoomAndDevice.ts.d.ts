import { Prisma } from "@prisma/client";
export declare const CategoryWithRoomAndDeviceConfig: {
    include: {
        roomAndDevices: {
            where: {
                status: "available";
            };
            select: {
                id: true;
                deviceType: true;
                version: true;
            };
        };
    };
    orderBy: {
        tier: "asc";
    };
};
export type CategoryWithRoomAndDevice = Prisma.CategoryGetPayload<typeof CategoryWithRoomAndDeviceConfig>;
//# sourceMappingURL=categoyWithRoomAndDevice.ts.d.ts.map