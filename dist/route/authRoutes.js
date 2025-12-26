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
const AuthController = __importStar(require("../controller/AuthController"));
const ValidateMiddleware = __importStar(require("../middleware/validateMiddleware"));
const authValidation_1 = require("../validation/bodyValidation/authValidation");
const router = (0, express_1.Router)();
/**
 * @route   POST /auth/register
 * @desc    Register user baru
 * @access  Public
 * @body    { email, password?, fullname, phone?, role? }
 */
router.post("/register", ValidateMiddleware.validateBody(authValidation_1.registerSchema), AuthController.register);
/**
 * @route   POST /auth/login
 * @desc    Login dengan email dan password
 * @access  Public
 * @body    { email, password }
 */
router.post("/login", ValidateMiddleware.validateBody(authValidation_1.loginSchema), AuthController.login);
/**
 * @route   POST /auth/login-otp
 * @desc    Login dengan OTP (2 step: request OTP, verify OTP)
 * @access  Public
 * @body    Step 1: { email }
 *          Step 2: { email, otp }
 */
router.post("/login-otp", ValidateMiddleware.validateBody(authValidation_1.loginOTPSchema), AuthController.loginOTP);
/**
 * @route   POST /auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 * @body    { refreshToken }
 */
router.post("/refresh-token", ValidateMiddleware.validateBody(authValidation_1.refreshTokenSchema), AuthController.refreshToken);
/**
 * @route   POST /auth/logout
 * @desc    Logout user
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post("/logout", AuthController.logout);
/**
 * @route   POST /auth/forgot-password
 * @desc    Request reset password (kirim OTP ke email)
 * @access  Public
 * @body    { email }
 */
router.post("/forgot-password", ValidateMiddleware.validateBody(authValidation_1.forgotPasswordSchema), AuthController.forgotPassword);
/**
 * @route   POST /auth/reset-password
 * @desc    Reset password dengan OTP dan password baru
 * @access  Public
 * @body    { email, otp, newPassword }
 */
router.post("/reset-password", ValidateMiddleware.validateBody(authValidation_1.resetPasswordSchema), AuthController.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map