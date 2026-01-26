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
const SubscriptionController_1 = require("../controller/SubscriptionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const ValidateMiddleware = __importStar(require("../middleware/validateMiddleware"));
const subscriptionValidation_1 = require("../validation/bodyValidation/subscriptionValidation");
const router = (0, express_1.Router)();
// Owner routes only
router.post("/", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, ValidateMiddleware.validateBody(subscriptionValidation_1.createSubscriptionSchema), SubscriptionController_1.createSubscription);
router.get("/", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, SubscriptionController_1.getSubscriptions);
router.get("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, SubscriptionController_1.getSubscriptionById);
router.put("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, ValidateMiddleware.validateBody(subscriptionValidation_1.updateSubscriptionSchema), SubscriptionController_1.updateSubscription);
router.delete("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, SubscriptionController_1.cancelSubscription);
exports.default = router;
//# sourceMappingURL=subscriptionRoutes.js.map