import {prisma} from "../database"

export const OrderRepository = {
    // Find first order
    findFirst(where: object, options?: object) {
        return prisma.order.findFirst({
            where,
            ...options,
        });
    }
}