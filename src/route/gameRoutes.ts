import { Router } from "express";
import {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} from "../controller/GameController";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  requireOwner,
  requireOwnerOrAdmin,
} from "../middleware/roleMiddleware";
import { validate } from "../middleware/validateMiddleware";
import {
  createGameSchema,
  updateGameSchema,
} from "../validation/gameValidation";

const router = Router();

// Public routes
router.get("/", getGames);
router.get("/:id", getGameById);

// Protected routes (owner/admin)
router.post(
  "/",
  authenticateToken,
  requireOwnerOrAdmin,
  validate(createGameSchema),
  createGame
);

router.put(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  validate(updateGameSchema),
  updateGame
);

router.delete("/:id", authenticateToken, requireOwner, deleteGame);

export default router;
