import { prisma } from "../database";

export const HolidayRepository = {
    // Find is date is holiday
    isDateHoliday(branchId: bigint, date: Date): Promise<boolean> {
        return prisma.branchHoliday.count({
            where: {
                branchId,
                date,
            },
        }).then(count => count > 0);
    },
}