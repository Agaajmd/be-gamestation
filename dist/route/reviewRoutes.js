"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReviewController_1 = require("../controller/ReviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const ValidateMiddleware = __importStar(require("../middleware/validateMiddleware"));
const reviewValidation_1 = require("../validation/bodyValidation/reviewValidation");
const router = (0, express_1.Router)();
// Customer routes
router.post("/", authMiddleware_1.authenticateToken, roleMiddleware_1.requireCustomer, ValidateMiddleware.validateBody(reviewValidation_1.createReviewSchema), ReviewController_1.createReview);
router.put("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireCustomer, ValidateMiddleware.validateBody(reviewValidation_1.updateReviewSchema), ReviewController_1.updateReview);
router.delete("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireCustomer, ReviewController_1.deleteReview);
// All authenticated users
router.get("/", authMiddleware_1.authenticateToken, ReviewController_1.getReviews);
router.get("/:id", authMiddleware_1.authenticateToken, ReviewController_1.getReviewById);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map