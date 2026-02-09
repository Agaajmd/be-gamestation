import { Request, Response } from "express";
import { updateUserInfoService } from "../service/UserService/userService";
import {
  HasNoAccessError,
  UserNotFoundError,
} from "../errors/UserError/userError";

import { handleError } from "../helper/responseHelper";


/**
 * Update user information
 * PUT /api/users/:id
 * User can only update their own information
 */
export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    // Validate authenticated user exists
    if (!req.user || !(req.user as any).userId) {
      throw new UserNotFoundError();
    }

    const userId = BigInt(req.params.id);
    const authenticatedUserId = BigInt((req.user as any).userId);
    const { email, fullname, phone } = req.body;

    // Check if user is updating their own information
    if (userId !== authenticatedUserId) {
      throw new HasNoAccessError();
    }

    const updatedUser = await updateUserInfoService({
      userId,
      email,
      fullname,
      phone,
    });

    res.status(200).json({
      success: true,
      message: "Informasi user berhasil diperbarui",
      data: updatedUser,
    });
  } catch (error) {
    handleError(error, res);
  }
};
