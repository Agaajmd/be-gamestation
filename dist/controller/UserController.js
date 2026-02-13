"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInfo = void 0;
const userService_1 = require("../service/UserService/userService");
const userError_1 = require("../errors/UserError/userError");
const responseHelper_1 = require("../helper/responseHelper");
/**
 * Update user information
 * PUT /api/users/:id
 * User can only update their own information
 */
const updateUserInfo = async (req, res) => {
    try {
        // Validate authenticated user exists
        if (!req.user || !req.user.userId) {
            throw new userError_1.UserNotFoundError();
        }
        const userId = BigInt(req.params.id);
        const authenticatedUserId = BigInt(req.user.userId);
        const { email, fullname, phone } = req.body;
        // Check if user is updating their own information
        if (userId !== authenticatedUserId) {
            throw new userError_1.HasNoAccessError();
        }
        const updatedUser = await (0, userService_1.updateUserInfoService)({
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
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateUserInfo = updateUserInfo;
//# sourceMappingURL=UserController.js.map