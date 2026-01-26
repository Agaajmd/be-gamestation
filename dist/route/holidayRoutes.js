"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HolidayController_1 = require("../controller/HolidayController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
// Public - Get holidays
router.get("/branches/:branchId/holidays", HolidayController_1.getBranchHolidays);
// Protected - Admin/Owner only`
router.post("/national/sync/:year", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwnerOrAdmin, HolidayController_1.syncNationalHolidays);
router.post("/custom", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwnerOrAdmin, HolidayController_1.addCustomHoliday);
router.post("/custom/bulk", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwnerOrAdmin, HolidayController_1.addCustomHolidaysBulk);
router.delete("/:holidayId", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwnerOrAdmin, HolidayController_1.deleteBranchHoliday);
exports.default = router;
//# sourceMappingURL=holidayRoutes.js.map