// Repositories
import { UserRepository } from "../../repository/userRepository";

// Helpers
import { sanitizeString, sanitizeEmail } from "../../helper/inputSanitizer";

// Errors
import {
  UserNotFoundError,
  EmailAlreadyExistsError,
} from "../../errors/UserError/userError";

/**
 * Update user information - email, fullname, phone
 */
export const updateUserInfoService = async (payload: {
  userId: bigint;
  email?: string;
  fullname?: string;
  phone?: string;
}) => {
  const {
    userId,
    email: rawEmail,
    fullname: rawFullname,
    phone: rawPhone,
  } = payload;

  // Sanitize inputs
  const email = rawEmail ? sanitizeEmail(rawEmail) : undefined;
  const fullname = rawFullname ? sanitizeString(rawFullname) : undefined;
  const phone = rawPhone ? sanitizeString(rawPhone) : undefined;

  // Check if user exists
  const user = await UserRepository.findById(userId);
  if (!user) {
    throw new UserNotFoundError();
  }

  // If email is being updated, check if it's already taken
  if (email && email !== user.email) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }
  }

  // Prepare data to update
  const updateData: {
    email?: string;
    fullname?: string;
    phone?: string;
  } = {};

  if (email) updateData.email = email;
  if (fullname) updateData.fullname = fullname;
  if (phone) updateData.phone = phone;

  // Update user
  const updatedUser = await UserRepository.updateUserInfo(userId, updateData);

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    fullname: updatedUser.fullname,
    phone: updatedUser.phone,
    role: updatedUser.role,
    isVerified: updatedUser.isVerified,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
};
