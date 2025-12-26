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
const GameController_1 = require("../controller/GameController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const ValidateMiddleware = __importStar(require("../middleware/validateMiddleware"));
const gameValidation_1 = require("../validation/bodyValidation/gameValidation");
const router = (0, express_1.Router)();
// Public routes
router.get("/", GameController_1.getGames);
router.get("/:id", GameController_1.getGameById);
// Protected routes (owner/admin)
router.post("/", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwnerOrAdmin, ValidateMiddleware.validateBody(gameValidation_1.createGameSchema), GameController_1.createGame);
router.put("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwnerOrAdmin, ValidateMiddleware.validateBody(gameValidation_1.updateGameSchema), GameController_1.updateGame);
router.delete("/:id", authMiddleware_1.authenticateToken, roleMiddleware_1.requireOwner, GameController_1.deleteGame);
exports.default = router;
//# sourceMappingURL=gameRoutes.js.map