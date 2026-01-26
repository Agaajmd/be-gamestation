"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdvanceBookingPriceController_1 = require("../controller/AdvanceBookingPriceController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const advanceBookingPriceValidation_1 = require("../validation/bodyValidation/advanceBookingPriceValidation");
const router = (0, express_1.default)();
/**
 * @route   POST /advance-booking-price
 * @desc    Menambahkan advance booking price untuk cabang tertentu
 * @access  Private (Owner)
 * @body    { branchId, daysInAdvance, additionalFee }
 */
router.post("/", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, (0, validateMiddleware_1.validateBody)(advanceBookingPriceValidation_1.advanceBookingPriceSchema), AdvanceBookingPriceController_1.addAdvanceBookingPrice);
exports.default = router;
//# sourceMappingURL=advanceBookingPriceRoutes.js.map