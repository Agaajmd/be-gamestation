import { Router } from "express";
import * as AuthController from "../controller/AuthController";
import { validate } from "../middleware/validateMiddleware";
import {
  registerSchema,
  loginSchema,
  loginOTPSchema,
  refreshTokenSchema,
} from "../validation/authValidation";

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register user baru
 * @access  Public
 * @body    { email, password?, fullname, phone?, role? }
 */
router.post("/register", validate(registerSchema), AuthController.register);

/**
 * @route   POST /auth/login
 * @desc    Login dengan email dan password
 * @access  Public
 * @body    { email, password }
 */
router.post("/login", validate(loginSchema), AuthController.login);

/**
 * @route   POST /auth/login-otp
 * @desc    Login dengan OTP (2 step: request OTP, verify OTP)
 * @access  Public
 * @body    Step 1: { email }
 *          Step 2: { email, otp }
 */
router.post("/login-otp", validate(loginOTPSchema), AuthController.loginOTP);

/**
 * @route   POST /auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 * @body    { refreshToken }
 */
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  AuthController.refreshToken
);

/**
 * @route   POST /auth/logout
 * @desc    Logout user
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post("/logout", AuthController.logout);

export default router;
