import { Router } from "express";
import { updateUserInfo } from "../controller/UserController";
import { authenticateToken } from "../middleware/authMiddleware";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import { updateUserInfoSchema } from "../validation/bodyValidation/userValidation";

const router = Router();

/**
 * Update user information
 * PUT /api/users/:id
 */
router.put(
  "/:id",
  authenticateToken,
  ValidateMiddleware.validateBody(updateUserInfoSchema),
  updateUserInfo,
);

export default router;
