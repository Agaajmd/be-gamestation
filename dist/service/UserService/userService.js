"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInfoService = void 0;
// Repositories
const userRepository_1 = require("../../repository/userRepository");
// Helpers
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Errors
const userError_1 = require("../../errors/UserError/userError");
/**
 * Update user information - email, fullname, phone
 */
const updateUserInfoService = async (payload) => {
    const { userId, email: rawEmail, fullname: rawFullname, phone: rawPhone, } = payload;
    // Sanitize inputs
    const email = rawEmail ? (0, inputSanitizer_1.sanitizeEmail)(rawEmail) : undefined;
    const fullname = rawFullname ? (0, inputSanitizer_1.sanitizeString)(rawFullname) : undefined;
    const phone = rawPhone ? (0, inputSanitizer_1.sanitizeString)(rawPhone) : undefined;
    // Check if user exists
    const user = await userRepository_1.UserRepository.findById(userId);
    if (!user) {
        throw new userError_1.UserNotFoundError();
    }
    // If email is being updated, check if it's already taken
    if (email && email !== user.email) {
        const existingUser = await userRepository_1.UserRepository.findByEmail(email);
        if (existingUser) {
            throw new userError_1.EmailAlreadyExistsError();
        }
    }
    // Prepare data to update
    const updateData = {};
    if (email)
        updateData.email = email;
    if (fullname)
        updateData.fullname = fullname;
    if (phone)
        updateData.phone = phone;
    // Update user
    const updatedUser = await userRepository_1.UserRepository.updateUserInfo(userId, updateData);
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
exports.updateUserInfoService = updateUserInfoService;
//# sourceMappingURL=userService.js.map