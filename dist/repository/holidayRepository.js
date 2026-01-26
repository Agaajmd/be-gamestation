"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidayRepository = void 0;
const database_1 = require("../database");
exports.HolidayRepository = {
    // Find is date is holiday
    isDateHoliday(branchId, date) {
        return database_1.prisma.branchHoliday.count({
            where: {
                branchId,
                date,
            },
        }).then(count => count > 0);
    },
};
//# sourceMappingURL=holidayRepository.js.map