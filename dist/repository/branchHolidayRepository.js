"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchHolidayRepository = void 0;
const database_1 = require("../database");
exports.BranchHolidayRepository = {
    // Find Many
    findMany(where, options) {
        return database_1.prisma.branchHoliday.findMany({
            where,
            ...options,
        });
    },
    // Create Many
    createMany(data) {
        return database_1.prisma.branchHoliday.createMany({
            data,
            skipDuplicates: true,
        });
    },
    // Update Many
    updateMany(where, data, options) {
        return database_1.prisma.branchHoliday.updateMany({
            where,
            data,
            ...options,
        });
    },
};
//# sourceMappingURL=branchHolidayRepository.js.map