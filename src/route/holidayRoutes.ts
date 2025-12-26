import { Router } from "express";
import {
  syncNationalHolidays,
  addCustomHoliday,
  getHolidays,
  updateHoliday,
  deleteHoliday,
  deleteNationalHoliday,
} from "../controller/HolidayController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwnerOrAdmin } from "../middleware/roleMiddleware";

const router = Router();

// Public - Get holidays
router.get("/holidays", getHolidays);

// Protected - Admin/Owner only
router.post(
  "/national/sync/:year",
  authenticateToken,
  requireOwnerOrAdmin,
  syncNationalHolidays
);

router.post(
  "/holidays/custom",
  authenticateToken,
  requireOwnerOrAdmin,
  addCustomHoliday
);

router.put(
  "/holidays/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  updateHoliday
);

router.delete(
  "/holidays/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  deleteHoliday
);

router.delete(
  "/holidays/national/:date",
  authenticateToken,
  requireOwnerOrAdmin,
  deleteNationalHoliday
);

export default router;
