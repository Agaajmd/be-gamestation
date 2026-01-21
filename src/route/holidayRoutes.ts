import { Router } from "express";
import {
  syncNationalHolidays,
  addCustomHoliday,
  getBranchHolidays,
  deleteBranchHoliday,
  addCustomHolidaysBulk,
} from "../controller/HolidayController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwnerOrAdmin } from "../middleware/roleMiddleware";

const router = Router();

// Public - Get holidays
router.get("/branches/:branchId/holidays", getBranchHolidays);

// Protected - Admin/Owner only`
router.post(
  "/national/sync/:year",
  authenticateToken,
  requireOwnerOrAdmin,
  syncNationalHolidays
);

router.post(
  "/custom",
  authenticateToken,
  requireOwnerOrAdmin,
  addCustomHoliday
);

router.post(
  "/custom/bulk",
  authenticateToken,
  requireOwnerOrAdmin,
  addCustomHolidaysBulk
);

router.delete(
  "/:holidayId",
  authenticateToken,
  requireOwnerOrAdmin,
  deleteBranchHoliday
);


export default router;
