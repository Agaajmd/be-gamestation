import { Router } from "express";
import * as AuthController from "../controller/AuthController";
import * as ValidateMiddleware from "../middleware/validateMiddleware";
import {
  registerSchema,
  loginSchema,
  loginOTPSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation/bodyValidation/authValidation";
import { checkVerificationStatusSchema, resendVerificationEmailSchema, verifyEmailSchema } from "../validation/queryValidation/authQueryValidation";

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register user baru
 * @access  Public
 * @body    { email, password?, fullname, phone?, role? }
 */
router.post("/register", ValidateMiddleware.validateBody(registerSchema), AuthController.register);

/**
 * @route   POST /auth/login
 * @desc    Login dengan email dan password
 * @access  Public
 * @body    { email, password }
 */
router.post("/login", ValidateMiddleware.validateBody(loginSchema), AuthController.login);

/**
 * @route   POST /auth/login-otp
 * @desc    Login dengan OTP (2 step: request OTP, verify OTP)
 * @access  Public
 * @body    Step 1: { email }
 *          Step 2: { email, otp }
 */
router.post("/login-otp", ValidateMiddleware.validateBody(loginOTPSchema), AuthController.loginOTP);

/**
  * @route   POST /auth/verify-email
  * @desc    Verifikasi email dengan token
  * @access  Public
*/
router.get("/verify-email", ValidateMiddleware.validateQuery(verifyEmailSchema), AuthController.verifyEmail);

/**
 * @route   POST /auth/resend-verification-email
 * @desc    Kirim ulang email verifikasi
 * @access  Public
 * @body    { email }
 */
router.post("/resend-verification-email", ValidateMiddleware.validateBody(resendVerificationEmailSchema), AuthController.resendVerificationEmail);

/**
 * @route   POST /auth/check-verification-status
 * @desc    Cek status verifikasi email
 * @access  Public
 * @body    { email }
 */
router.post("/check-verification-status", ValidateMiddleware.validateBody(checkVerificationStatusSchema), AuthController.checkVerificationStatus);

/**
 * @route   POST /auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 * @body    { refreshToken }
 */
router.post(
  "/refresh-token",
  ValidateMiddleware.validateBody(refreshTokenSchema),
  AuthController.refreshToken
);

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
router.post(
  "/forgot-password",
  ValidateMiddleware.validateBody(forgotPasswordSchema),
  AuthController.forgotPassword
);

/**
 * @route   POST /auth/reset-password
 * @desc    Reset password dengan OTP dan password baru
 * @access  Public
 * @body    { email, otp, newPassword }
 */
router.post(
  "/reset-password",
  ValidateMiddleware.validateBody(resetPasswordSchema),
  AuthController.resetPassword
);

export default router;
