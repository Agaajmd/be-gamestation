import Router from "express";
import { addAdvanceBookingPrice } from "../controller/AdvanceBookingPriceController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwner } from "../middleware/roleMiddleware";
import { validateBody } from "../middleware/validateMiddleware";
import { advanceBookingPriceSchema } from "../validation/bodyValidation/advanceBookingPriceValidation";

const router = Router();

/**
 * @route   POST /advance-booking-price
 * @desc    Menambahkan advance booking price untuk cabang tertentu
 * @access  Private (Owner)
 * @body    { branchId, daysInAdvance, additionalFee }
 */
router.post(
  "/",
  authenticateToken,
  requireOwner,
  validateBody(advanceBookingPriceSchema),
  addAdvanceBookingPrice
);

export default router;
