import Router from "express";
import {
  addAdvanceBookingPrice,
  getAdvanceBookingPrices,
  updateAdvanceBookingPrice,
  deleteAdvanceBookingPrice,
} from "../controller/AdvanceBookingPriceController";
import { authenticateToken } from "../middleware/authMiddleware";
import { requireOwner } from "../middleware/roleMiddleware";
import { validateBody } from "../middleware/validateMiddleware";
import {
  advanceBookingPriceSchema,
  updateAdvanceBookingPriceSchema,
} from "../validation/bodyValidation/advanceBookingPriceValidation";

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
  addAdvanceBookingPrice,
);

router.get("/", authenticateToken, requireOwner, getAdvanceBookingPrices);

/**
 * @route   PUT /advance-booking-price/:id
 * @desc    Mengupdate advance booking price berdasarkan ID
 * @access  Private (Owner)
 * @body    { minDays?, maxDays?, additionalFee? }
 */
router.put(
  "/:id",
  authenticateToken,
  requireOwner,
  validateBody(updateAdvanceBookingPriceSchema),
  updateAdvanceBookingPrice,
);

/**
 * @route   DELETE /advance-booking-price/:id
 * @desc    Menghapus advance booking price berdasarkan ID
 * @access  Private (Owner)
 */
router.delete(
  "/:id",
  authenticateToken,
  requireOwner,
  deleteAdvanceBookingPrice,
);

export default router;
