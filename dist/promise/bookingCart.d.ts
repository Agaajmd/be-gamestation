import { Prisma } from "@prisma/client";
export declare const bookingCartConfig: {
    include: {
        customer: {
            select: {
                fullname: true;
                email: true;
                phone: true;
            };
        };
        branch: {
            select: {
                name: true;
            };
        };
        orderItems: {
            include: {
                roomAndDevice: {
                    select: {
                        roomNumber: true;
                        deviceType: true;
                        version: true;
                    };
                };
            };
        };
    };
};
export type BookingCartWithRelations = Prisma.OrderGetPayload<typeof bookingCartConfig>;
//# sourceMappingURL=bookingCart.d.ts.map